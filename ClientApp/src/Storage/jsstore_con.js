import * as JsStore from "jsstore";
import workerInjector from "jsstore/dist/worker_injector"

export async function initDb() {
    const connection = new JsStore.Connection();
    connection.addPlugin(workerInjector);
    await connection.initDb(getDbSchema());
    return connection
}

function getDbSchema() {
    //create tables for current price & daily price history
    const tblPrice = {
        name: "CurrentPrice-v1",
        columns: {
            ticker: {
                primaryKey: true,
                dataType: "string"
            },
            open: {
                dataType: "number"
            },
            high: {
                dataType: "number"
            },
            low: {
                dataType: "number"
            },
            price: {
                dataType: "number"
            },
            volume: {
                dataType: "number"
            },
            latest_trading_day: {
                dataType: "date_time"
            },
            previous_close: {
                dataType: "number"
            },
            change: {
                dataType: "number"
            },
            change_percent: {
                dataType: "number"
            },
            data_expiration: {
                dataType: "date_time"
            }
        }
    }
    const tblDailyHistory = {
        name: "DailyPriceHistory-v1",
        columns: {
            ticker: {
                primaryKey: true,
                dataType: 'string'
            },
            data_as_of: {
                dataType: "date_time"
            },
            open: {
                dataType: "number"
            },
            high: {
                dataType: "number"
            },
            low: {
                dataType: "number"
            },
            close: {
                dataType: "number"
            },
            volume: {
                dataType: "number"
            },
            data_expiration: {
                dataType: "date_time"
            }
        }
    }

    const db = {
        name: "StockDataCache",
        tables: [tblPrice, tblDailyHistory]
    }

    return db;
}
