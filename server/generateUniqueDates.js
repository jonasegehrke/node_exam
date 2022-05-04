import { faker } from '@faker-js/faker'
import fs from 'fs'
import moment from 'moment';

const dates = []

let startDate = "2022-05-01";

let i  = 0;
while(dates.length < 300){
    //const date = faker.date.between('2022-05-01', '2023-02-05');

    i++;
    const date = moment(startDate).add(i, "days").format("YYYY-MM-DD");


    if(moment(date).day() === 0 || moment(date).day() === 6){
        continue
    }
    if(!dates.includes(date)){
        dates.push(date)
    }



}



fs.writeFile('tmp.json', JSON.stringify(dates), function (err) {
    if (err) throw err;
    console.log(err);
});

