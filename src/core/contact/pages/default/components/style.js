import makeStyles from '@material-ui/core/styles/makeStyles';
import { CreatePadding, FlexColumn } from '@theme/mixins';

export default makeStyles(() => ({
    container: {
        ...FlexColumn,
        ...CreatePadding(30, 20, 20, 20),
    },
    btn: {
        marginTop: '22px',
        marginBottom: '44px',
        display: 'flex',
        alignSelf: 'center',
    },
    message: {
        marginBottom: 30,
    },
}));