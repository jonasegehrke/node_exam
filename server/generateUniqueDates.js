import { faker } from '@faker-js/faker'
import fs from 'fs'
import moment from 'moment';

const dates = []



while(dates.length < 200){
    const date = faker.date.between('2022-05-01', '2022-12-01');
    const date2 = moment(date).format('YYYY-MM-DD')
    if(!dates.includes(date2)){
        dates.push(date2)
    }

}



fs.writeFile('tmp.json', JSON.stringify(dates), function (err) {
    if (err) throw err;
    console.log(err);
});
