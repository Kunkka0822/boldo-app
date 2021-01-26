import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from "@utils";

export default EStyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    bell: {
        width: 40,
        height: 40,
        margin: 6
    },

    post: {
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 10,
        backgroundColor: '$whiteColor',
        padding: 10,
        height: 300,
        borderRadius: 5
    },
    loading: {
        color: "$primaryColor",
    }
});