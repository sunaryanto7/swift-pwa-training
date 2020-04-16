import useStyles from "./style";
import Typography from "@components/Typography";
import moment from "moment";
import classNames from "classnames";
import currency from "@helpers/currency";

const dataSummary = [
  { item: "Sub total", value: 1998000 },
  { item: "Shipping", value: 35000 },
];

const ItemProduct = ({}) => {
  const styles = useStyles();
  return (
    <div className={styles.itemContainer}>
      <img src="/assets/img/sample/product.png" className={styles.productImg} />
      <div className={styles.detailItem}>
        <Typography variant="label"> Product Name </Typography>
        <Typography variant="span"> Varian </Typography>
        <Typography variant="span" className={styles.textDetail}>
          Color : Black
        </Typography>
        <Typography variant="span" className={styles.textDetail}>
          Size : M
        </Typography>
        <div className="flex-grow"></div>
        <Typography variant="span" type="bold">
          IDR 999.000
        </Typography>
      </div>
    </div>
  );
};

const DetailOrder = ({ t, data = [1, 2] }) => {
  const styles = useStyles();
  let totalSummary = 0;
  return (
    <div className="column">
      <div className={classNames(styles.block, styles.detail)}>
        <Typography variant="title" letter="uppercase" type="bold">
          {t("order:order")} Complete
        </Typography>
        <Typography variant="span">
          {moment().format("MMM DD, YYYY")}
        </Typography>
        <Typography
          variant="p"
          type="bold"
          letter="uppercase"
          className={styles.labelDetail}
        >
          SHIPPED TO
        </Typography>
        <Typography variant="span" align="center">
          Diasty
          <br /> Jl Kalibata Timur I no.1 rt.01/rw.01 <br /> Pancoran, Jakarta
          Selatan 12740 <br />
          081234567890
        </Typography>
        <Typography
          variant="p"
          type="bold"
          letter="uppercase"
          className={styles.labelDetail}
        >
          payment method
        </Typography>
        <Typography variant="span">Credit Card</Typography>
      </div>
      <div className={styles.block}>
        {data.map((item) => (
          <ItemProduct key={item} />
        ))}
      </div>
      <div className={styles.block}>
        {dataSummary.map((list, index) => (
          <div className={styles.listSummary} key={index}>
            <Typography variant="span" letter="capitalize">
              {list.item}
            </Typography>
            <Typography variant="span" letter="uppercase">
              {currency({ currency: "idr", value: list.value })}
            </Typography>
          </div>
        ))}
        <div className={styles.listSummary}>
          <Typography variant="title" type="bold" letter="capitalize">
            Total
          </Typography>
          <Typography variant="title" type="bold" letter="uppercase">
            {
              (dataSummary.map((item) => {
                totalSummary += item.value;
              }),
              currency({ currency: "idr", value: totalSummary }))
            }
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DetailOrder;