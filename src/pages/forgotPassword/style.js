import { makeStyles } from "@material-ui/core";
import { CreatePadding, FlexColumn, CreateMargin } from '@theme/mixins'

export default makeStyles(theme => ({
    container : {
        ...FlexColumn,
        ...CreatePadding(0,30,30,30)
    },
    btn : {
        alignSelf : 'center'
    },
    email: {
        ...CreateMargin(15,5,15,5,)
    }
}))