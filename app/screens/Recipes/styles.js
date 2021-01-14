import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from "@utils";
import { Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window')
export default EStyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    bell:{
        width: 40,
        height: 40,
        margin:6
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
        height:300,
        borderRadius:5
    },

    item: {
        width: screenWidth - 150,
        height: screenWidth - 200,
        borderRadius : 5
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
        borderRadius : 5
    },

    title:{
        position:'absolute',
        bottom:30,
        left:30,
        color:EStyleSheet.value('$whiteColor')
    }
});