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

  search: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "relative",
  },

  input: {
    backgroundColor: "#F0F2F5",
    height: "100%",
    width: "100%",
    borderRadius: 40,
    paddingLeft: 40,
  },

  icon: {
    position: "absolute",
    top: 17,
    left: 25,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  itemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10
  },
})
