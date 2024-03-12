import { GhibliAPI } from "./datasources/GhibliAPI"

export type DataSourceContext = {
  dataSources: {
    trackApi: GhibliAPI
  }
}