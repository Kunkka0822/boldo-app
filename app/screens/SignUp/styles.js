import React from "react";
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  contain: {
    alignItems: "center",
    padding: 30,
  },
  field: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical:10,
    marginHorizontal:10,
  },
  activeTab:{
    color:'$primaryColor',
    fontWeight:'bold',
    fontSize:18,
    paddingBottom:3,
    borderColor:'$primaryColor',
    borderBottomWidth:2,
  },

  deActiveTab:{
    color:'$blackColor',
    fontSize:18,
  },

  blog_user_img: {
    width: 80,
    height: 80,
    borderRadius: 80,
  },

  formText: {
    width:'100%',
    marginTop:10,
    marginBottom:5,
  },

  formTextWorkHistory: {
    flex:1,
    marginTop:10,
    marginBottom:5,
  },
  textareaContainer: {
    height: 80,
    padding: 8,
    width: "100%",
    borderRadius: 5,
    borderWidth:1,
    borderStyle:'solid',
    borderColor:'$inputBoderColor'
  },
  textarea: {
    textAlignVertical: 'top',  // hack android
    height: 170,
    fontSize: 14,
    color: '$blackColor',
  },
  dropDown:{
    width:"100%",
    borderWidth:1,
    borderRadius: 5,
    borderStyle:'solid',
    borderColor:'$inputBoderColor'
  },
  workHistory:{
    flexDirection : "row",
    marginTop:2,
  },
  locationForm:{
    width:"100%",
    borderWidth:1,
    borderRadius: 5,
    borderStyle:'solid',
    borderColor:'$inputBoderColor',
  },
  tag:{
    backgroundColor:'$tagColor',
    padding:5,
    borderColor:'$tagColor',
    borderRadius:10,
    color:'$blackColor',
    fontSize:16,
    marginHorizontal:2
  }
});
