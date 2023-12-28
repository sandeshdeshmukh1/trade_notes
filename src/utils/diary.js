import { diaries, selectedMonth, endOfList, spinnerLoadingPage, spinnerLoadMore, pageId, diaryIdToEdit, diaryUpdate, selectedItem, renderData } from "../stores/globals"
import { usePageRedirect } from "./utils";
let diaryQueryLimit = 10
let diaryPagination = 0

export async function useGetDiaries(param1, param2) {
    //param1: true is diary page
    //param2: true is diary delete
    //console.log("param 1 "+ param1)
    //console.log("param 2 "+ param2)
    return new Promise(async (resolve, reject) => {
        console.log(" -> Getting diaries");
        const parseObject = Parse.Object.extend("diaries");
        const query = new Parse.Query(parseObject);
        query.equalTo("user", Parse.User.current());
        query.descending("dateUnix");
        if (param1) {
            query.limit(diaryQueryLimit);
            query.skip(diaryPagination)
        } else {
            query.greaterThanOrEqualTo("dateUnix", selectedMonth.value.start)
            query.lessThanOrEqualTo("dateUnix", selectedMonth.value.end)
        }
        const results = await query.find();
        if (results.length > 0) {
            if (param1) { //when on diary page and not deleting diary
                //console.log("param2 "+param2+" and we are concatenating")
                results.forEach(element => {
                    diaries.push(JSON.parse(JSON.stringify(element))) // Here we concat
                });
            } else {
                diaries.length = 0 // here we do not concat so we reset
                results.forEach(element => {
                    diaries.push(JSON.parse(JSON.stringify(element))) // Here we concatenante
                });
            }
        } else {
            if (pageId.value == "diary"){
                endOfList.value = true
            }
        }

        //console.log(" -> Diaries " + JSON.stringify(diaries))
        diaryPagination = diaryPagination + diaryQueryLimit
        if (pageId.value != "daily") spinnerLoadingPage.value = false //we remove it later
        spinnerLoadMore.value = false
        resolve()
    })
}



export async function useUploadDiary() {

    const parseObject = Parse.Object.extend("diaries");

    if (diaryIdToEdit.value) {
        console.log(" -> Updating diary")
        console.log("diaryUpdate "+JSON.stringify(diaryUpdate))
        const query = new Parse.Query(parseObject);
        query.equalTo("objectId", diaryIdToEdit.value);
        const results = await query.first();
        if (results) {
            results.set("date", diaryUpdate.dateDateFormat)
            results.set("dateUnix", diaryUpdate.dateUnix)
            results.set("journal", diaryUpdate.journal)
            await results.save() //very important to have await or else too quick to update
            usePageRedirect()


        } else {
            alert("Update query did not return any results")
        }
    } else {
        const query = new Parse.Query(parseObject);
        query.equalTo("dateUnix", diaryUpdate.dateUnix);
        const results = await query.first();
        if (results) {
            alert("Diary with that date already exists")
            return
        }

        console.log(" -> saving diary")
        const object = new parseObject();
        object.set("user", Parse.User.current())
        object.set("date", diaryUpdate.dateDateFormat)
        object.set("dateUnix", diaryUpdate.dateUnix)
        object.set("journal", diaryUpdate.journal)
        object.setACL(new Parse.ACL(Parse.User.current()));
        object.save()
            .then((object) => {
                console.log(' -> Added new diary with id ' + object.id)
                usePageRedirect()

            }, (error) => {
                console.log('Failed to create new object, with error code: ' + error.message);
            });
    }
}

export async function useDeleteDiary(param1, param2) {
    //console.log("selected item " + selectedItem.value)
    console.log("\nDELETING JOURNAL ENTRY")
    const parseObject = Parse.Object.extend("diaries");
    const query = new Parse.Query(parseObject);
    query.equalTo("objectId", selectedItem.value);
    const results = await query.first();

    if (results) {
        await results.destroy()
        await refreshDiaries()

    } else {
        alert("There was a problem with the query")
    }
}

async function refreshDiaries() {
    console.log(" -> Refreshing diary entries")
    return new Promise(async (resolve, reject) => {
        diaryQueryLimit = 10
        diaryPagination = 0
        diaries.length = 0
        await useGetDiaries(true)
        //useInitPopover()
        await (renderData.value += 1)
        selectedItem.value = null
        resolve()
    })
}