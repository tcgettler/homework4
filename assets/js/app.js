// Initial array of stocks
const stocks = ['AMZN', "AAPL", 'FB', 'GOOG', 'DIS'];
const validationstocks = [];
let datedata = [];
let highdata = [];
const infodata = [];
let companydata = ['CEO','website', 'description'];

const ctx = $("#myChart");


// Function for displaying stock data
const render = function () {
  // Delete the content inside the stocks-view div prior to adding new stocks
  $("#stocks-view").empty()
  // Loop through the array of stocks, then generate buttons for each stock in the array
  for(let i = 0; i < stocks.length; i++){
    if (i === 0){
    $("#stocks-view").append(`<button class="get-stock btn btn-primary active" value=${stocks[i]}>${stocks[i]}</button>`)
    } else {
    $("#stocks-view").append(`<button class="get-stock btn btn-primary" value=${stocks[i]}>${stocks[i]}</button>`) 
    }
    $('.show').dropdown('toggle');
  }
};


// This function handles events where the add stock button is clicked
const addButton = function(event) {
  // event.preventDefault() prevents submit button from trying to send a form.
  // Using a submit button instead of a regular button allows the user to hit
  // 'Enter' instead of clicking the button if desired
  event.preventDefault();
  let newStock = $("#stock-input").val().trim().toUpperCase();
    //run through validation list to make sure stock symbol exists
    for (let i=0; i < validationstocks.length; i++){
        if (newStock === validationstocks[i]){
            //if found push stock to the array
            stocks.push(newStock);
            //render the new stocks
            render();
            $("#stock-input").val("")
            return;
        } else {
            
        }
    };
    //if not found alert user
    alert("your stock is not found")
  // Write code to delete the contents of the former input
  $("#stock-input").val("")
};
//run the add button function when it is clicked
$('#add-stock').on('click', addButton);
//update the information displayed when any stock symbol button is clicked
$("#stocks-view").on('click', '.get-stock', function(event){
  event.preventDefault();
  //obtain the value of which button was clicked
  const stock = $(this).val();
  //clear the information already displayed
  $('#stockName').empty();
  $('#stockPrice').empty();
  $('#stock-info').empty();
  $('#stock-logo').empty();
  $('#news').empty();
  $('.btn').removeClass('active');
  $(this).addClass('active');
  //Construct all urls for ajax calls
    const chartURL = `https://api.iextrading.com/1.0/stock/${stock}/chart/1m`;
    const infoURL = `https://api.iextrading.com/1.0/stock/${stock}/quote`;
    const logoURL = `https://api.iextrading.com/1.0/stock/${stock}/logo`;
    const companyURL = `https://api.iextrading.com/1.0/stock/${stock}/company`;
    const newsURL = `https://api.iextrading.com/1.0/stock/${stock}/news/last/10`
    //ajax call to obtain chart information
    $.ajax({
        url: chartURL,
        method: "GET"
    }).done(function(response){
        datedata=[];
        highdata=[];
        for (let i=0; i < response.length; i++){
            datedata.push(response[i].label);
            highdata.push(response[i].close);
        }
    })
    //display the new chart
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datedata,
            datasets: [{
                label: 'high',
                data: highdata,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                    }
                }]
            }
        }
    });
    //run the ajax call to obtain stock information
    $.ajax({
        url:infoURL,
        method: "GET"
    }).done(function(response){
        $('#stockName').text(response.companyName);
        $('#stockPrice').text("$" + response.latestPrice);
    });
    //run the ajax information to obtain additional information
    $.ajax({
        url: companyURL,
        method: "GET"
    }).done(function(response){
        //run through all additional information currentyl selected
        for (let i =0; i < companydata.length; i++){
            let information = companydata[i].charAt(0).toUpperCase() + companydata[i].slice(1);
            console.log(response[information]);
            $('#stock-info').append(`<tr><td><strong>${information}:</strong>&emsp;</td><td>${response[companydata[i]]}</td><hr></tr>`);
        };
    });
    //run ajax call to obtain the company logo
    $.ajax({
        url: logoURL,
        method: "GET"
    }).done(function(response){
        $('#stockLogo').html(`<img src=${response.url} max-height="100%" max-width="100%">`)
    });
    //run ajax call to obtain news articles 
    $.ajax({
        url: newsURL,
        method: "GET"
    }).done(function(response){
        for (let i = 0; i < response.length; i++){
            $('#news').append(`<tr class="text-wrap"><td>${response[i].headline}</td></tr><tr class="text-wrap"><td><a href="${response[i].url}" target="_blank">Click here to go to the article.</a></td></tr>`);
        };
    });
});

//display the inital stock for amazon upon page load
$(document).ready(function(){
    const queryURL = `https://api.iextrading.com/1.0/ref-data/symbols`;
    const chartURL = `https://api.iextrading.com/1.0/stock/${stocks[0]}/chart/1m`;
    const infoURL = `https://api.iextrading.com/1.0/stock/${stocks[0]}/quote`;
    const logoURL = `https://api.iextrading.com/1.0/stock/${stocks[0]}/logo`;
    const companyURL = `https://api.iextrading.com/1.0/stock/${stocks[0]}/company`;
    const newsURL = `https://api.iextrading.com/1.0/stock/${stocks[0]}/news/last/10`
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response){
        for(let i = 0; i < response.length; i++){
            validationstocks.push(response[i].symbol);
        }
    });

    $.ajax({
        url: chartURL,
        method: "GET"
    }).done(function(response){
        for (let i=0; i < response.length; i++){
            datedata.push(response[i].label);
            highdata.push(response[i].close);
        }
    })
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: datedata,
            datasets: [{
                label: 'high',
                data: highdata,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                    }
                }]
            }
        }
    });
    $.ajax({
        url:infoURL,
        method: "GET"
    }).done(function(response){
        $('#stockName').text(response.companyName);
        $('#stockPrice').text("$" + response.latestPrice);
    });

    $.ajax({
        url: companyURL,
        method: "GET"
    }).done(function(response){
        for (let i =0; i < companydata.length; i++){
            let information = companydata[i].charAt(0).toUpperCase() + companydata[i].slice(1);
            console.log(response[information]);
            $('#stock-info').append(`<tr><td><strong>${information}:</strong>&emsp;</td><td>${response[companydata[i]]}</td><hr></tr>`);
        };
    });

    $.ajax({
        url: logoURL,
        method: "GET"
    }).done(function(response){
        $('#stockLogo').html(`<img src=${response.url} max-height="100%" max-width="100%">`)
    });

    $.ajax({
        url: newsURL,
        method: "GET"
    }).done(function(response){
        for (let i = 0; i < response.length; i++){
            $('#news').append(`<tr class="text-wrap"><td>${response[i].headline}</td></tr><tr class="text-wrap"><td><a href="${response[i].url}" target="_blank">Click here to go to the article.</a></td></tr>`);
        };
    });
    // Calling the renderButtons function to display the initial list of stocks
    render();
});

