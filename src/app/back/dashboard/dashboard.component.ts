import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites } from '../../enums/enums';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit
{
  dataBookings: any;
  optionsBookings: any;

  dataEmployees: any;
  optionsEmployees: any;

  dataBookingStatus: any;
  optionsBookingStatus: any;

  dataClientsPerEmployees: any;
  optionsClientsPerEmployees: any;

  constructor(private injector: Injector)
  {
    super(injector, []);
    this.site = WebSites.Back;
    this.pageName = "Dashboard";

    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });
  }

  ngOnInit()
  {
    super.ngOnInit();

    this.dataBookings = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Current year bookings',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [65, 59, 80, 81, 56, 55, 40, 70, 90, 65, 78, 100]
        },
        {
          label: 'Last year bookings',
          backgroundColor: '#9CCC65',
          borderColor: '#7CB342',
          data: [28, 48, 40, 19, 86, 27, 90, 70, 45, 60, 80, 95]
        }
      ]
    }

    this.optionsBookings = {
      title: {
        display: true,
        text: 'Total Bookings',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };

    this.dataEmployees = {
      labels: ['Employee 1', 'Employee 2', 'Employee 3'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };
    this.optionsEmployees = {
      title: {
        display: true,
        text: 'Bookings per employee',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };

    this.dataBookingStatus = {
      labels: ['Active', 'Honored', 'Canceled'],
      datasets: [
        {
          data: [300, 250, 10],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };
    this.optionsBookingStatus = {
      title: {
        display: true,
        text: 'Total Bookings Status',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };

    this.dataClientsPerEmployees = {
      labels: ['Employee 1', 'Employee 2', 'Employee 3'],
      datasets: [
        {
          data: [20, 43, 38],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };
    this.optionsClientsPerEmployees = {
      title: {
        display: true,
        text: 'Number of clients per employee',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };
  }
}
