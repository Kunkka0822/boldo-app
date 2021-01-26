import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from "@utils";

export default EStyleSheet.create({
    arrow: {
        width: 30,
        height: 30,
        resizeMode:'contain'
    },
    close: {
        width: 20,
        height: 20,
        resizeMode:'contain'
    },
    
    post: {
        resizeMode: 'cover',
        flex:1,
        padding:10,
        height:200,
        width:'100%',
        marginTop:10,
        borderRadius: 5,
    },
    textareaContainer: {
        borderRadius: 5,
        borderWidth: 1,
        marginTop:5,
        borderStyle: 'solid',
        borderColor: '$inputBoderColor',
        backgroundColor:'$whiteColor',
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        fontSize: 14,
        color: '$blackColor',
        marginHorizontal: 10,
        height:'100%'
    },

    selection:{
        backgroundColor : '$whiteColor'
    },

    title:{
        borderColor : '$inputBoderColor',
        borderBottomWidth: 2,
        fontSize : 16,
        padding:10,
        width:'100%',
        backgroundColor:'$whiteColor',
        height:50,
        borderRadius: 5,
        marginTop:5
    },
});