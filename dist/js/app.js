let incomePeriod, nextPayday, paymentFreq
let cards = []

let monthsArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function currency(num, places){
    const x = Math.pow(10,places)
    return Math.round(num*x)/x
}

function getStrMonth(month){
    switch(month){
        case 0:
            return 'January';
            break;
        case 1:
            return 'February';
            break;
        case 2:
            return 'March';
            break;
        case 3:
            return 'April';
            break;
        case 4:
            return 'May';
            break;
        case 5:
            return 'June';
            break;
        case 6:
            return 'July';
            break;
        case 7:
            return 'August';
            break;
        case 8:
            return 'September';
            break;
        case 9:
            return 'October';
            break;
        case 10:
            return 'November';
            break;
        case 11:
            return 'December';
            break;
    }

}

function storeUser(){
    incomePeriod = document.querySelector('select#income-period').value
    nextPayday = new Date(document.querySelector('input#next-pay').value + ' 00:00:00')
    paymentFreq = document.querySelector('select#payment-time').value
    // console.log(document.querySelector('input#next-pay').value)
    // document.querySelector('input#submit_user').disabled = true
    document.querySelector('div#cc_info').style.display = 'block'
    document.querySelector('div#user_info').style.display = 'none'
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
        calculate_payoff()
    }
}

function calculateCard(card, day, month, i){
    let curCard = cards[card]
    let payPeriodsInMonth = 1
    let dailyAPR = (curCard.apr / 100.00) / 365.00
    let cardCalc = []
    let payDays = []
    while(curCard.balance > 0){
        let daysInMonth = monthsArr[month]
        if (day + 14 <= daysInMonth){
            payDays.push(day)
            day += 14
            payPeriodsInMonth++
        } else {
            payDays.push(day)
            prevBal = curCard.balance
            curCard.balance = currency(((Number(curCard.balance)+Number(curCard.bills))*
            (1+(dailyAPR*daysInMonth)))-(Number(curCard.payment)*payPeriodsInMonth), 2)
            if(curCard.balance <= 0){
                curCard.balance = 0
                // if (card != cards.length - 1){
                //     payment = curCard.payment - curCard.bills / 2
                // }
            } else if (prevBal < curCard.balance){
                document.querySelector('div#output').innerHTML += '<h2>Card will never be paid off</h2>'
                return false
            }
            cardCalc.push({balance: curCard.balance, month: month, days: payDays})
            //increment month and add days and start over
            payDays = []
            day = (day + 14) - daysInMonth
            if (month === 11){
                month = 0
            } else {
                month++
            }
            payPeriodsInMonth = 1
        }
    }
    if (curCard.nickname != ''){
        document.querySelector('div#output').innerHTML += '<h3>Card ' + curCard.nickname + '</h3>'
    } else {
        let cardNum = Number(card) + 1
        document.querySelector('div#output').innerHTML += '<h3>Card ' + cardNum + '</h3>'
    }
    cardCalc.forEach(element => {
        document.querySelector('div#output').innerHTML += '<p>' + i + ' ' + getStrMonth(element.month) + ' ' +  element.balance + '</p>'
        i++
    });

    return [day, month, i]
    // return cardCalc
}

function calculate_payoff(){
    document.querySelector('div#output').innerHTML = ''
    let month = nextPayday.getMonth()
    let day = nextPayday.getDate()
    let i = 1

    for (card in cards){

        result = calculateCard(card, day, month, i)
        day, month, i = result[0], result[1], result[2]
    }
    if (result != false){
        document.querySelector('div#output').innerHTML = '<h2> Total Cards Ran: ' + cards.length + '</h2>' + document.querySelector('div#output').innerHTML
    }
    document.querySelector('div#cc_info').style.display = 'none'
    document.querySelector('div#user_info').style.display = 'block'
    cards = []
}

// function calculatePayoff(){
//     document.querySelector('div#output').innerHTML = ''
//     // document.querySelector('h3#output').innerHTML = ''
//     // document.querySelector('p#output').innerHTML = ''
//     let month = []
//     for (card in cards){
//         let curCard = cards[card]
//         let dailyAPR = (curCard.apr / 100.00) / 365.00
//         let curmonth = nextPayday.getMonth()
//         let curday = nextPayday.getDate()
//         let monthPay = 1
//         let payment = 0
//         while (curCard.balance > 0){

//             if (paymentFreq === 'pay-monthly' || incomePeriod === 'monthly') {
//                 //Do calculations for every monthly pay

//             } else if (paymentFreq === 'pay-period') {
//                 //Do calculations for every payday based on payday
//                 daysInMonth = monthsArr[curmonth]
//                 // console.log(curday + '|' + curmonth + '|' + monthPay)
//                 if (curday + 14 < daysInMonth){
//                     curday += 14
//                     monthPay++
//                 } else {
//                     //end the month calculations
//                     curCard.balance = currency(((Number(curCard.balance)+Number(curCard.bills))*(1+(dailyAPR*daysInMonth)))-(Number(curCard.payment)*monthPay), 2)
//                     if(curCard.balance <= 0){
//                         curCard.balance = 0
//                         if (card != cards.length - 1){
//                             payment = curCard.payment - curCard.bills / 2
//                         }
//                     }
//                     month.push(curCard.balance)
//                     //increment month and add days and start over
//                     curday = (curday + 14) - daysInMonth
//                     if (curmonth === 11){
//                         curmonth = 0
//                     } else {
//                         curmonth++
//                     }
//                     monthPay = 1
//                 }
//                 // month = nextPayday.getMonth()
//                 // console.log(months.month)
//                 // console.log(nextPayday.getDate())
//             }
//         }
//         let i = 1
//         cardNum = Number(card) + 1
//         if (Number(cardNum) > 1){
//             document.querySelector('div#output').innerHTML = '<h3>Total Cards ' + cardNum + '</h3>' + document.querySelector('div#output').text
//         } else {
//             document.querySelector('div#output').innerHTML = '<h3>Card ' + cardNum + '</h3>'
//         }
//         month.forEach(element => {
//             document.querySelector('div#output').innerHTML += '<p>' + i + ' month: ' +  element + '</p>'
//             i++
//         });
//     }
//     // document.querySelector('div#output').innerHTML = month
//     document.querySelector('div#cc_info').style.display = 'none'
//     document.querySelector('div#user_info').style.display = 'block'
//     cards = []
// }