import { Component, OnInit } from '@angular/core';
import { HolidayService, SharedService } from '../../services';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {
  holidays = [];
  holidayList = [];
  constructor(private holidayService: HolidayService, private sharedService: SharedService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getAllHolidays();
  }

  getAllHolidays() {
    this.holidayService.getAllHolidays().subscribe((res) => {
      if (res.failure) {
        this.holidays = [];
        console.log(res.error);
      } else {
        this.holidays = res.result;
        this.populateHolidayList();
      }
    });
  }

  private populateHolidayList() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < this.holidays.length; index++) {
      const element = this.holidays[index];
      const holidayDate = new Date(element.holidayDate);
      const existingHolidayDate = this.holidayList.find((holiday) => holiday.month === months[holidayDate.getMonth()]);
      if (existingHolidayDate) {
        existingHolidayDate.holidays.push(element);
      } else {
        this.holidayList.push({ month: months[holidayDate.getMonth()], holidays: [element] });
      }
    }
  }
}
