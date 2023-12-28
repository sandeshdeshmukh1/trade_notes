import { excursions, queryLimit, satisfactionArray, satisfactionTradeArray, selectedRange } from "../stores/globals";

export async function useGetSatisfactions() {
    return new Promise(async (resolve, reject) => {
        console.log("\nGETTING SATISFACTIONS");
        satisfactionTradeArray.length = 0
        satisfactionArray.length = 0
        let startD = selectedRange.value.start
        let endD = selectedRange.value.end
        const parseObject = Parse.Object.extend("satisfactions");
        const query = new Parse.Query(parseObject);
        query.equalTo("user", Parse.User.current());
        query.greaterThanOrEqualTo("dateUnix", startD)
        query.lessThan("dateUnix", endD)
        query.limit(queryLimit.value); // limit to at most 10 results

        const results = await query.find();
        for (let i = 0; i < results.length; i++) {
            let temp = {}
            const object = results[i];
            temp.tradeId = object.get('tradeId')
            temp.satisfaction = object.get('satisfaction')
            temp.dateUnix = object.get('dateUnix')
            if (temp.tradeId != undefined) {
                satisfactionTradeArray.push(temp)
            } else {
                satisfactionArray.push(temp)
            }

        }
        //console.log(" -> Trades satisfaction " + JSON.stringify(satisfactionArray))
        resolve()

    })
}


export async function useGetExcursions() {
    return new Promise(async (resolve, reject) => {
        console.log("\nGETTING EXCURSIONS")
        let startD = selectedRange.value.start
        let endD = selectedRange.value.end
        const parseObject = Parse.Object.extend("excursions");
        const query = new Parse.Query(parseObject);
        query.equalTo("user", Parse.User.current());
        query.ascending("order");
        query.greaterThanOrEqualTo("dateUnix", startD)
        query.lessThan("dateUnix", endD)
        query.limit(queryLimit.value); // limit to at most 10 results
        excursions.length = 0
        const results = await query.find();
        results.forEach(element => {
            const parseElement = JSON.parse(JSON.stringify(element))
            excursions.push(parseElement)
        });
        //console.log(" -> excursions " + JSON.stringify(excursions))
        resolve()
    })
}