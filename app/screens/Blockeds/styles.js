import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from "@utils";

export default EStyleSheet.create({
    setting: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },

    activeTab:{
        color:'$primaryColor',
        borderColor:'$primaryColor',
        borderBottomWidth:2,
        textAlign:'center',
        marginHorizontal:15,
    },
    
    deActiveTab:{
        color:'$blackColor',
        textAlign:'center',
        marginHorizontal:15,
    },
});