import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from "@utils";

export default EStyleSheet.create({
    arrow:{
        width: 40,
        height: 40,
    },
    close:{
        width: 15,
        height: 15,
    },
    camera:{
        width: 20,
        height: 20,
    },

    content:{
        width:'100%',
        borderColor : '#CFCFCF',
        borderBottomWidth: 2,
        textAlignVertical : 'top',
        flex:1
    },  
    
    title:{
        borderColor : '#CFCFCF',
        borderBottomWidth: 2,
        fontSize : 16,
        paddingVertical:1,
        width:'100%'
    },

    recipe:{
        width:'100%',
        height:'100%',
    }
});