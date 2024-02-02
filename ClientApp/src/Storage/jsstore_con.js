import * as JsStore from "jsstore";
import workerInjector from "jsstore/dist/worker_injector"

async function initDb() {
    const connection = new JsStore.Connection();
    connection.addPlugin(workerInjector);
    await connection.initDb(getDbSchema());
    return connection
}

export const cache = initDb();

function getDbSchema() {
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
            },
            current_holdings: {
                dataType: "number"
            }
        }
    }

    const tblStockDataHistory = {
        name: "StockDataPriceHistory-v1",
        columns: {
            ticker_time_block: {
                primaryKey: true,
                dataType: "string"
            },
            date_time_block_string: {
                dataType: "string"
            },
            chart_group: {
                dataType: "string"
            },
            interval: {
              dataType: "string"
            },
            ticker: {
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
            close: {
                dataType: "number"
            },
            volume: {
                dataType: "number"
            },
            time_block: {
                dataType: "date_time"
            },
            data_pulled: {
                dataType: "date_time"
            },
            data_expiration: {
                dataType: "date_time"
            },
            data_source: {
                dataType: "string"
            },
            current_holdings: {
                dataType: "number"
            }
        }
    }

    const tblTransactionHistory = {
        name: "TransactionHistory-v1",
        columns: {
            transaction_id: {
                primaryKey: true,
                dataType: "number"
            },
            ticker: {
                dataType: "string"
            },
            ticker_time_block: {
                dataType: "string"
            },
            ticker_date_block: {
                dataType: "string"
            },
            traded_shares: {
                dataType: "number"
            },
            market_value: {
                dataType: "number"
            },
            transaction_type: {
                dataType: "string"
            },
            transaction_date: {
                dataType: "date_time"
            }
        }
    }

    const db = {
        name: "StockDataCache",
        tables: [tblPrice, tblTransactionHistory, tblStockDataHistory]
    }

    return db;
}