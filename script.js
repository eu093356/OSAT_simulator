// 入力欄取得
const inputs = document.querySelectorAll("input");

// 自動計算
inputs.forEach(input => {

    input.addEventListener(
        "input",
        calculate
    );

});

// ======================================
// 計算メイン
// ======================================

function calculate() {

    const currentVotes =
        Number(
            document.getElementById("currentVotes").value
        );

    const currentRate =
        Number(
            document.getElementById("currentRate").value
        );

    const targetRate =
        Number(
            document.getElementById("targetRate").value
        );

    const futureVotes =
        Number(
            document.getElementById("futureVotes").value
        );

    const futureRate =
        Number(
            document.getElementById("futureRate").value
        );

    // 未入力チェック

    if (

        document.getElementById("currentVotes").value === "" ||
        document.getElementById("currentRate").value === "" ||
        document.getElementById("targetRate").value === "" ||
        document.getElementById("futureVotes").value === "" ||
        document.getElementById("futureRate").value === ""

    ){

        return;

    }

    // 入力範囲チェック

    if (

        currentVotes <= 0 ||
        currentRate < 0 ||
        currentRate > 100 ||
        targetRate < 0 ||
        targetRate > 100 ||
        futureVotes < 0 ||
        futureRate < 0 ||
        futureRate > 100

    ){

        return;

    }

    // ==================================
    // 現在値計算
    // ==================================

    // 現在の大変満足件数

    const currentCount =
        currentVotes *
        currentRate /
        100;

    // ==================================
    // 将来予測
    // ==================================

    // 今後の大変満足件数

    const futureCount =
        futureVotes *
        futureRate /
        100;

    // 入力した満足率の場合

    const futureTitle =

        document.getElementById("futureTitle");

            if(futureTitle) {

            futureTitle.textContent =
             `大変満足率${futureRate}%の場合`;

        }
        

    const futureResultTile =

        document.getElementById("futureResultTitle");

            if (futureResultTile) {
                
                futureResultTile.textContent =
                    `追加回答数${futureVotes}件でのOSAT`;
                
            }

    const allRateTitle =

            document.getElementById("allRateTitle")

            if (allRateTitle) {
                
                allRateTitle.textContent =
                `追加回答数${futureVotes}件でのOSAT`;
            }
    
        const futureResult =

        (
            currentCount +
            futureCount
        )
        /
        (
            currentVotes +
            futureVotes
        )
        *
        100;

    const futureNeedTitle =

        document.getElementById("futureNeedTitle");
    
            if(futureNeedTitle) {
                
                futureNeedTitle.textContent =
                `OSAT${targetRate}%への必要回答数`;

            }
    // ==================================
    // 全件大変満足の場合
    // ==================================

    const allTitle =

        document.getElementById("allTitle");

            if(allTitle){

                allTitle.textContent =
                "すべて大変満足だった場合";

            }
        
    const allNeedTitle =

        document.getElementById("allNeedTitle");

            if (allNeedTitle) {

                allNeedTitle.textContent =
                `OSAT${targetRate}%への必要回答数`;

            }
    
    const allRate =

        (
            currentCount +
            futureVotes
        )
        /
        (
            currentVotes +
            futureVotes
        )
        *
        100;

    // ==================================
    // 必要回答数計算
    // ==================================

    let futureNeed;

    let allNeed;

    // すでに目標達成済み

    if(targetRate <= currentRate){

        futureNeed = 0;

        allNeed = 0;

    }

    else{

        // 今後入力した満足率の場合

        if(
            futureRate <= targetRate
        ){

            futureNeed = "達成不可";

        }

        else{

            futureNeed = Math.ceil(

                (
                    targetRate / 100 *
                    currentVotes -
                    currentCount
                )
                /
                (
                    futureRate / 100 -
                    targetRate / 100
                )

            );

        }

        // 全員大変満足の場合

        allNeed = Math.ceil(

            (
                targetRate / 100 *
                currentVotes -
                currentCount
            )
            /
            (
                1 -
                targetRate / 100
            )

        );

    }

    // ==================================
    // 表示更新
    // ==================================

    document.getElementById(
        "currentCount"
    ).textContent =

        Math.ceil(currentCount)
        + "件";

    document.getElementById(
        "futureResult"
    ).textContent =

        futureResult.toFixed(1)
        + "%";

    document.getElementById(
        "futureNeed"
    ).textContent =

        futureNeed
        +
        (
            typeof futureNeed === "number"
            ?
            "件"
            :
            ""
        );

    document.getElementById(
        "allRate"
    ).textContent =

        allRate.toFixed(1)
        + "%";

    document.getElementById(
        "allNeed"
    ).textContent =

        allNeed
        +
        (
            typeof allNeed === "number"
            ?
            "件"
            :
            ""
        );

    // 判定表示

    updateStatus(
        futureResult,
        targetRate,
        futureNeed
    );

    // 履歴用に保存

    latestData = {

        currentVotes,
        currentRate,
        targetRate,
        futureVotes,
        futureRate,
        futureResult,
        futureNeed,
        allRate,
        allNeed

    };

}

function updateStatus(
    result,
    target,
    need
){

    const status =
    document.getElementById(
        "resultStatus"
    );

    const reason =
    document.getElementById(
        "resultReason"
    );

    if(!status || !reason){

        return;

    }

    if(result >= target){

        status.textContent =
        "達成可能";

        reason.textContent =
        "今後の回答で目標OSATを達成できます。";

    }
    else if(
        need === "達成不可"
    ){

        status.textContent =
        "達成不可";

        reason.textContent =
        "設定した今後の大変満足率では目標OSATに届きません。";

    }
    else{

        status.textContent =
        "未達成";

        reason.textContent =
        "追加回答が必要です。";

    }

}

// 最新結果保存用

let latestData = null;

//履歴データ取得

let historyData = JSON.parse(
    localStorage.getItem("osatHistory")
)
|| [];

// ======================================
// 保存ボタン
// ======================================

const saveButton =
document.getElementById(
    "saveButton"
);

if(saveButton){

    saveButton.addEventListener(
        "click",
        ()=>{

            if(!latestData){

                alert(
                    "計算結果がありません"
                );

                return;

            }

            const now =
                new Date();


            const record = {

                date:

                now.toLocaleString(
                    "ja-JP"
                ),

                ...latestData

            };

            historyData.push(
                record
            );

            localStorage.setItem(
                "osatHistory",
                JSON.stringify(
                    historyData
                )
            );

            displayHistory();

            alert(
                "結果を保存しました"
            );

        }
    );

}

// ======================================
// 履歴表示
// ======================================

function displayHistory(){

    const body =
    document.getElementById(
        "historyBody"
    );

    if(!body){

        return;

    }

    body.innerHTML = "";

    historyData.forEach(
        (data,index)=>{

            const tr =
            document.createElement(
                "tr"
            );

            tr.innerHTML = `

            <td>${data.date}</td>

            <td>${data.currentVotes}</td>

            <td>${data.currentRate}%</td>

            <td>${data.targetRate}%</td>

            <td>${data.futureVotes}</td>

            <td>${data.futureRate}%</td>

            <td>${data.futureResult.toFixed(1)}%</td>

            <td>
            ${
                typeof data.futureNeed === "number"
                ?
                data.futureNeed+"件"
                :
                data.futureNeed
            }
            </td>

            <td>${data.allRate.toFixed(1)}%</td>

            <td>
            ${
                typeof data.allNeed === "number"
                ?
                data.allNeed+"件"
                :
                data.allNeed
            }
            </td>

            <td>

            <button
            class="loadHistory"
            data-index="${index}"
            >
            読込
            </button>

            </td>

            `;

            body.appendChild(
                tr
            );

        }
    );

    // 読込ボタン設定

    document
    .querySelectorAll(
        ".loadHistory"
    )
    .forEach(
        button=>{

            button.addEventListener(
                "click",
                ()=>{

                    loadHistory(
                        Number(
                            button.dataset.index
                        )
                    );

                }
            );

        }
    );

}

// ======================================
// 履歴読み込み
// ======================================

function loadHistory(index){

    const data =
    historyData[index];

    if(!data){

        return;

    }

    document.getElementById(
        "currentVotes"
    ).value =
    data.currentVotes;

    document.getElementById(
        "currentRate"
    ).value =
    data.currentRate;

    document.getElementById(
        "targetRate"
    ).value =
    data.targetRate;

    document.getElementById(
        "futureVotes"
    ).value =
    data.futureVotes;

    document.getElementById(
        "futureRate"
    ).value =
    data.futureRate;

    calculate();

}

// ======================================
// 起動時に履歴表示
// ======================================

displayHistory();

// ======================================
// リセット機能
// ======================================

const resetButton =
document.getElementById(
    "resetButton"
);

if(resetButton){

    resetButton.addEventListener(
        "click",
        ()=>{

            document
            .querySelectorAll(
                "input"
            )
            .forEach(
                input=>{

                    input.value = "";

                }
            );

            document.getElementById(
                "resultStatus"
            ).textContent = "-";

            document.getElementById(
                "currentCount"
            ).textContent = "-";

            document.getElementById(
                "futureResult"
            ).textContent = "-";

            document.getElementById(
                "futureNeed"
            ).textContent = "-";

            document.getElementById(
                "allRate"
            ).textContent = "-";

            document.getElementById(
                "allNeed"
            ).textContent = "-";

            latestData = null;

        }
    );

}

// ======================================
// 履歴削除
// ======================================

const clearHistoryButton =
document.getElementById(
    "clearHistoryButton"
);

if(clearHistoryButton){

    clearHistoryButton.addEventListener(
        "click",
        ()=>{

            if(
                confirm(
                    "履歴を削除しますか？"
                )
            ){

                historyData = [];

                localStorage.removeItem(
                    "osatHistory"
                );

                displayHistory();

            }

        }
    );

}

// ======================================
// CSV出力
// ======================================

const csvButton =
document.getElementById(
    "csvButton"
);

if(csvButton){

    csvButton.addEventListener(
        "click",
        exportCSV
    );

}

function exportCSV(){

    if(
        historyData.length === 0
    ){

        alert(
            "履歴がありません"
        );

        return;

    }

    let csv =

    "日時,現在件数,現状OSAT,目標OSAT,今後回答,今後満足率,予測OSAT,必要回答数,100%OSAT,100%必要件数\n";

    historyData.forEach(
        data=>{

            csv +=

            [
                data.date,
                data.currentVotes,
                data.currentRate,
                data.targetRate,
                data.futureVotes,
                data.futureRate,
                data.futureResult.toFixed(1),
                data.futureNeed,
                data.allRate.toFixed(1),
                data.allNeed

            ].join(",")

            + "\n";

        }
    );

    const blob =
    new Blob(
        [
            csv
        ],
        {
            type:
            "text/csv;charset=utf-8;"
        }
    );

    const url =
    URL.createObjectURL(
        blob
    );

    const a =
    document.createElement(
        "a"
    );

    a.href = url;

    a.download =
    "OSAT_history.csv";

    a.click();

    URL.revokeObjectURL(
        url
    );

}

// ======================================
// ページ読み込み時処理
// ======================================

window.addEventListener(
    "DOMContentLoaded",
    ()=>{

        displayHistory();

    }
);

// ======================================
// Excel出力
// ======================================

const excelButton =
document.getElementById(
    "excelButton"
);

if(excelButton){

    excelButton.addEventListener(
        "click",
        exportExcel
    );

}

function exportExcel(){

    if(historyData.length === 0){

        alert(
            "履歴がありません"
        );

        return;

    }

    let html = `

    <table border="1">

    <tr>

    <th>日時</th>
    <th>現在件数</th>
    <th>現状OSAT</th>
    <th>目標OSAT</th>
    <th>今後回答</th>
    <th>今後満足率</th>
    <th>予測OSAT</th>
    <th>必要回答数</th>
    <th>100%OSAT</th>
    <th>100%必要件数</th>

    </tr>

    `;

    historyData.forEach(data=>{

        html += `

        <tr>

        <td>${data.date}</td>
        <td>${data.currentVotes}</td>
        <td>${data.currentRate}%</td>
        <td>${data.targetRate}%</td>
        <td>${data.futureVotes}</td>
        <td>${data.futureRate}%</td>
        <td>${data.futureResult.toFixed(1)}%</td>
        <td>${data.futureNeed}</td>
        <td>${data.allRate.toFixed(1)}%</td>
        <td>${data.allNeed}</td>

        </tr>

        `;

    });

    html += "</table>";

    const blob =
    new Blob(
        [
            "\ufeff",
            html
        ],
        {
            type:
            "application/vnd.ms-excel"
        }
    );

    const url =
    URL.createObjectURL(
        blob
    );

    const a =
    document.createElement(
        "a"
    );

    a.href = url;

    a.download =
    "OSAT_simulator.xls";

    a.click();

    URL.revokeObjectURL(
        url
    );

}