import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from "@utils";

export default EStyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },

    post:{
        flex:1, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin:10,
        backgroundColor:'$whiteColor',
        padding:10,
        borderRadius:5
    },

    textareaContainer: {
        height:150,
        marginTop:20,
        padding: 8,
        width: "100%",
        borderRadius: 5,
        borderWidth:1,
        borderStyle:'solid',
        borderColor:'$inputBoderColor'
      },
      textarea: {
        height:'100%',
        textAlignVertical: 'top',  // hack android
        fontSize: 15,
        color: '$textColor',
      }
});