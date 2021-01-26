import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from "@utils";

export default EStyleSheet.create({
    setting: {
        width: 35,
        height: 35,
        marginLeft:10
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
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