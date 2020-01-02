import { DurationType } from '../enums/enums';
import { HttpHeaders } from '@angular/common/http';
import { UsersService } from './users.service';

import { Timeslot } from '../objects/timeslot';
export class CommonServiceMethods
{
  public static getDurationArray(durType: DurationType): number[]
  {
    let minutesUnit = 5;//asta trebuie sa vina din DB din setarile din back ale fiecarei companii
    let durationArray: number[] = [];
    if (durType == DurationType.Minutes)
    {
      for (let i = 1; i < 60 / minutesUnit; i++)      
      {
        durationArray.push(i * minutesUnit);
      }
    }
    if (durType == DurationType.Hours)
    {
      for (let i = 1; i < 24; i++) 
      {
        durationArray.push(i);
      }
    }
    if (durType == DurationType.Days)
    {
      for (let i = 1; i < 366; i++) 
      {
        durationArray.push(i);
      }
    }
    return durationArray;
  }

  public static addUserDateOffset(date: Date): Date
  {
    //trebuie creata data cu timezone-ul clientului pentru a evita conversia la UTC cand se trimite la baza de date (JSON.stringify)      
    var _userOffset = date.getTimezoneOffset() * 60000; // [min*60000 = ms]

    let newDate = new Date(date.getTime() + this.invertNumberSign(_userOffset));
    return newDate;
  }

  public static invertNumberSign(n: number): number
  {
    let inverted: number;
    if (n != 0)
      inverted = -n;
    else
      inverted = n;

    return inverted;
  }
  public static getDateString(date: Date, withTime?: boolean)
  {
    var month = date.getMonth() + 1; //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();

    var dateString = year + "-" +
      (month.toString().length < 2 ? "0" + month.toString() : month.toString()) + "-" +
      (day.toString().length < 2 ? "0" + day.toString() : day.toString());

    if (withTime)
    {
      var hour = date.getHours().toString().length < 2 ? "0" + date.getHours().toString() : date.getHours().toString();
      var minutes = date.getMinutes().toString().length < 2 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();

      dateString = dateString + "T" + hour + ":" + minutes;
    }

    return dateString;
  }
  public static getTimeString(date: Date)
  {
    var hour = date.getHours();
    var minutes = date.getMinutes().toString().length < 2 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();

    var dateString = hour + ":" + minutes;
    return dateString;
  }
  public static getDateTimeString(date: Date)
  {
    var month = date.getMonth() + 1; //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    var dateString = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":00";
    return dateString;
  }

  computeDayColumnWidth(hoursMatrix: Timeslot[][][]): string
  {
    let width = '13.3%';

    switch (hoursMatrix[0][0].length) 
    {
      case 12:
        width = '600px';
        break;
      case 6:
        width = '300px';
        break;
      case 4:
        width = "200px";
        break;
    }

    return width;
  }
  computeTimeslotWidth(hoursMatrix: Timeslot[][][]): string
  {
    let width = '45%';

    var rawWidth = 100 / hoursMatrix[0][0].length;
    var reducedWidth = rawWidth - 5 / 100 * rawWidth;

    width = reducedWidth.toString() + '%';

    return width;
  }
}

