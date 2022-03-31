import { StyleSheet } from "react-native"
import colors from "./color"

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },

  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },

  tinyLogo: {
    width: 150,
    height: 40,
    marginLeft: -20,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  button: {
    marginRight: 20,
  },

  scrollView: {
    backgroundColor: "#ffffff",
    width: "100%",
  },

  card: {
    width: "100%",
    flexDirection: "column",
    marginBottom: 30
  },

  cardBar: {
    height: 55,
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  userName: {
    marginLeft: 10,
    fontSize: 15,
  },

  cardBarImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },

  cardImage: {
    width: "100%",
    height: 500,
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
  },

  cardActionsLeft: {
    flexDirection: "row",
  },

  cardDetail: {
    paddingHorizontal: 10,
    height: "auto",
  },

  cardDetailText: {
    fontSize: 18
  }
})
