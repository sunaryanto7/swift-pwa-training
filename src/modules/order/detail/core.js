import Layout from '@components/Layouts';
import { useRouter } from 'next/router';
import Skeleton from './views/skeleton';
import { getOrderDetail } from '../services';

const OrderDetail = (props) => {
    const { t, Content } = props;
    const router = useRouter();
    const { id } = router.query;
    let detail = [];
    let pageConfig = {
        title: `${t('order:order')}  `,
        header: 'relative', // available values: "absolute", "relative", false (default)
        headerTitle: `${t('order:order')} #${detail.length > 0 ? detail[0].order_number : ''}`,
        bottomNav: false,
    };
    const [params] = React.useState({
        order_id: id,
    });
    const { loading, data, error } = getOrderDetail(params);
    if (loading || !data || error) return <Layout pageConfig={pageConfig} {...props}><Skeleton /></Layout>;
    if (!loading && data && data.customerOrders) {
        // eslint-disable-next-line prefer-destructuring
        detail = data.customerOrders.items;
    }
    const currency = detail.length > 0 ? detail[0].detail[0].global_currency_code : 'USD';

    pageConfig = {
        title: `${t('order:order')} ${router.query.id}`,
        header: 'relative', // available values: "absolute", "relative", false (default)
        headerTitle: `${t('order:order')} #${detail.length > 0 ? detail[0].order_number : ''}`,
        bottomNav: false,
    };
    return (
        <Layout pageConfig={pageConfig} {...props}>
            <Content {...props} detail={detail} currency={currency} />
        </Layout>
    );
};

export default OrderDetail;
