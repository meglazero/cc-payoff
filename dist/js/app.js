let incomePeriod, nextPayday, paymentFreq
let cards = []
// let months = {
//     0: 'Jan',
//     Jan: 31,
//     1: 'Feb',
//     Feb: 28,
//     2: 'Mar',
//     Mar: 31,
//     3: 'Apr',
//     Apr: 30,
//     4: 'May',
//     May: 31,
//     5: 'Jun',
//     Jun: 30,
//     6: 'Jul',
//     Jul: 31,
//     7: 'Aug',
//     Aug: 31,
//     8: 'Sep',
//     Sep: 30,
//     9: 'Oct',
//     Oct: 31,
//     10: 'Nov',
//     Nov: 30,
//     11: 'Dec',
//     Dec: 31
// }

let monthsArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function currency(num, places){
    const x = Math.pow(10,places)
    return Math.round(num*x)/x
}

// let curTime = new Date()
// document.querySelector('input#next-pay').value = curTime.getFullYear() + '-' + curTime.getMonth() + '-' + curTime.getDate()

// function getStrMonth(date){
//     strMonth = date.getMonth()

// }

function storeUser(){
    incomePeriod = document.querySelector('select#income-period').value
    nextPayday = new Date(document.querySelector('input#next-pay').value + ' 00:00:00')
    paymentFreq = document.querySelector('select#payment-time').value
    // console.log(document.querySelector('input#next-pay').value)
    // document.querySelector('input#submit_user').disabled = true
}

function addCard(input){
    cardNick = document.querySelector('input#nickname')
    cardAPR = document.querySelector('input#apr')
    cardBills = document.querySelector('input#bills-on-card')
    cardPayment = document.querySelector('input#pay-towards-card')
    cardBalance = document.querySelector('input#card-balance')

    card = {
        nickname: cardNick.value,
        apr: cardAPR.value,
        bills: cardBills.value,
        payment: cardPayment.value,
        balance: cardBalance.value
    }

    cards.push(card)

    if(input === true){
        cardNick.value = ''
        cardAPR.value = ''
        cardBills.value = ''
        cardPayment.value = ''
        cardBalance.value = ''
    } else {
        // document.querySelector('input#add_card').disabled = true
        // document.querySelector('input#submit_cards').disabled = true
        calculatePayoff()
    }
}

function calculatePayoff(){
    let month = []
    for (card in cards){
        let curCard = cards[card]
        let dailyAPR = (curCard.apr / 100.00) / 365.00
        let curmonth = nextPayday.getMonth()
        let curday = nextPayday.getDate()
        let monthPay = 1
        let payment = 0
        while (curCard.balance > 0){

            if (paymentFreq === 'pay-monthly' || incomePeriod === 'monthly') {
                //Do calculations for every monthly pay

            } else if (paymentFreq === 'pay-period') {
                //Do calculations for every payday based on payday
                daysInMonth = monthsArr[curmonth]
                // console.log(curday + '|' + curmonth + '|' + monthPay)
                if (curday + 14 < daysInMonth){
                    curday += 14
                    monthPay++
                } else {
                    //end the month calculations
                    curCard.balance = currency(((Number(curCard.balance)+Number(curCard.bills))*(1+(dailyAPR*daysInMonth)))-(Number(curCard.payment)*monthPay), 2)
                    if(curCard.balance <= 0){
                        curCard.balance = 0
                        if (card != cards.length - 1){
                            payment = curCard.payment - curCard.bills / 2
                        }
                    }
                    month.push(curCard.balance)
                    //increment month and add days and start over
                    curday = (curday + 14) - daysInMonth
                    if (curmonth === 11){
                        curmonth = 0
                    } else {
                        curmonth++
                    }
                    monthPay = 1
                }
                // month = nextPayday.getMonth()
                // console.log(months.month)
                // console.log(nextPayday.getDate())
            }
        }
        let i = 1
        document.querySelector('h3#output').innerHTML += 'Card ' + i
        month.forEach(element => {
            document.querySelector('p#output').innerHTML += i + ' month: ' +  element + '<br>'
            i++
        });
    }
    // document.querySelector('div#output').innerHTML = month
}