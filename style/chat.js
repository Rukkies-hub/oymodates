import { StyleSheet } from "react-native"
import colors from "./color"

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },

  appBar: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  appBarLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 10,
  },

  appBarRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  list: {
    paddingHorizontal: 17,
  },

  footer: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    padding: 5,
  },
  
  btnSend: {
    backgroundColor: "#00BFFF",
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: "center",
    justifyContent: "center",
  },

  iconSend: {
    width: 30,
    height: 30,
    alignSelf: "center",
  },

  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },

  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },

  balloon: {
    maxWidth: 250,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
  },

  itemIn: {
    alignSelf: "flex-start",
  },
  
  itemOut: {
    alignSelf: "flex-end",
    backgroundColor: "#4169e1",
  },

  time: {
    alignSelf: "flex-end",
    margin: 15,
    fontSize: 12,
    color: "#808080",
  },
  
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#eeeeee",
    borderRadius: 300,
    padding: 5,
  },

  chatFunctions: {
    height: 60,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  chatFunctionsLeft: {
    width: "16%",
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  chatFunctionsCenter: {
    width: "70%",
  },

  chatFunctionsCenterInput: {
    backgroundColor: "#F0F2F5",
    height: 40,
    width: "100%",
    borderRadius: 40,
    paddingLeft: 10,
  },

  chatFunctionsRight: {
    width: "10%",
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
})
