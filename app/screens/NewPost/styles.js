import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from "@utils";

export default EStyleSheet.create({
    arrow: {
        width: 40,
        height: 40,
    },
    close: {
        width: 15,
        height: 15,
    },
    camera: {
        width: 20,
        height: 20,
    },
    gallery: {
        width: 20,
        height: 20,
    },
    post: {
        height: 300,
        resizeMode: 'contain',
        width:'100%',
        flex:1,
        padding:10
    },
    textareaContainer: {
        width: "100%",
        borderRadius: 15,
        borderWidth: 1,
        marginTop:10,
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
    }
});