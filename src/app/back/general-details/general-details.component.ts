import { SpecialDay } from '../../objects/special-day';
import { SelectItem } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, Injector, NgZone, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '../../shared/base-component';
import { WebSites, Actions } from '../../enums/enums';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompanyService } from '../../app-services/company.service';
import { Company } from '../../objects/company';
import { GenericResponseObject } from '../../objects/generic-response-object';
import { CountriesService } from '../../app-services/countries.service';
import { Country } from '../../objects/country';
import { WorkingHours } from '../../objects/working-hours';
import { Image } from '../../objects/image';
import { WorkingDay } from '../../objects/working-day';
import { GenericDictionary } from '../../objects/generic-dictionary';
import { ImageService } from '../../app-services/image.service';


@Component({
  selector: 'bf-general-details',
  templateUrl: './general-details.component.html',
  styleUrls: ['./general-details.component.css']
})
export class GeneralDetailsComponent extends BaseComponent implements OnInit
{
  public COMP_IMG = require("./img/company.jpg");

  mapOptions: any;
  genDetailsForm: FormGroup;
  company: Company;
  countriesDic: Country[] = [];
  categories: GenericDictionary[] = [];
  subcategories: GenericDictionary[] = [];
  workingHours: WorkingHours;
  specialDayWorkingHours: WorkingHours;
  countries: SelectItem[];
  gMapOverlays: any[] = [];
  specialDays: any[] = [];
  displayDialog: boolean = false;
  displayImageDialog: boolean = false;
  selectedImage: Image = null;
  isRepeatEveryYear: boolean = false;
  selectedWeekDayIndex: number = -1;
  selectedDate: Date = null;
  selectedSpecialDay: SpecialDay = null;
  selectedSpecialDayWorkingHoursString: string = '';

  calendarOptions: any;
  images: Image[] = [];

  tabs: any;
  subTabs: any;

  @ViewChild('map') map;
  @ViewChild('address') address: ElementRef;



  constructor(private injector: Injector,
    private companyService: CompanyService,
    private imageService: ImageService,
    private countriesService: CountriesService,
    private cd: ChangeDetectorRef
  )
  {
    super(injector, [
      'lblGeneralDetails',
      'lblSave',
      'lblSaved',
      'lblPositionUpdated',
      'lblName',
      'lblDescription',
      'lblCategory',
      'lblSubCategory',
      'lblCountry',
      'lblTown',
      'lblAddress',
      'lblPhone',
      'lblWorkingHours',
      'lblSpecialDays',
      'lblSpecialDay',
      'lblUploadImage',
      'lblDelete',
      'lblRepeatEveryYear',
      'lblSelectedDayAlreadySpecial',
      'lblDetails',
      'lblTimeSettings',
      'lblOnlyFiveImagesPermitted',
      'lblOnlyOneMBfilesPermitted'
    ]);
    this.site = WebSites.Back;
    this.pageName = "General details";

    let parentRoute: ActivatedRoute = this.route.parent;
    this.routeSubscription = parentRoute.params.subscribe((params: any) =>
    {
      if (params.hasOwnProperty('id'))
      {
        this.idCompany = +params['id'];
      }
    });

    this.calendarOptions = {
      left: '',
      center: 'title',
      right: 'today,prev,next'
    };

    this.loadCategories(null);
    this.loadCountriesDic();

    this.reloadCompany();
    this.loadCompanyImages();

    this.companyService.getCompanyWorkingHours(this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.workingHours = gro.objList[0];
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company working hours', ''));

    this.mapOptions = {
      center: { lat: 45.951249, lng: 24.793491 },
      zoom: 5
    };

    this.tabs = {
      details: { active: true },
      timeSettings: { active: false }
    };
    this.subTabs = {
      workingHours: { active: true },
      specialDays: { active: false }
    };

    this.specialDayWorkingHours = new WorkingHours(0, this.idCompany, '',
      new WorkingDay('', null),
      new WorkingDay('', null),
      new WorkingDay('', null),
      new WorkingDay('', null),
      new WorkingDay('', null),
      new WorkingDay('', null),
      new WorkingDay('', null));
    this.specialDays = [];

  }

  ngOnInit()
  {
    this.logAction(this.idCompany, false, Actions.View, "", "");
    this.initForm();

    this.reloadCompanySpecialDays();
  }
  selectTab(title: string)
  {
    if (title == 'details')
    {
      this.tabs.details.active = true;
      this.tabs.timeSettings.active = false;
    }
    if (title == 'timeSettings')
    {
      this.tabs.details.active = false;
      this.tabs.timeSettings.active = true;
    }
  }
  selectSubTab(title: string)
  {
    if (title == 'workingHours')
    {
      this.subTabs.workingHours.active = true;
      this.subTabs.specialDays.active = false;
    }
    if (title == 'specialDays')
    {
      this.subTabs.workingHours.active = false;
      this.subTabs.specialDays.active = true;
    }
  }

  onChangeCulture()//asta se declasneaza in base component la schimbarea de cultura
  {
    this.reloadCompanySpecialDays();
  }
  initForm()
  {
    this.genDetailsForm = new FormGroup({
      'name': new FormControl(this.company == null ? '' : this.company.name, Validators.required),
      'description': new FormControl(this.company == null ? '' : this.company.description),
      'category': new FormControl(this.company == null ? '' : this.company.idCategory, Validators.required),
      'subcategory': new FormControl(this.company == null ? '' : this.company.idSubcategory, Validators.required),
      'country': new FormControl(this.company == null ? '' : this.company.idCountry, Validators.required),
      'town': new FormControl(this.company == null ? '' : this.company.town, Validators.required),
      'address': new FormControl(this.company == null ? '' : this.company.address, Validators.required),
      'email': new FormControl(this.company == null ? '' : this.company.email, [Validators.required,
      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]),
      'phone': new FormControl(this.company == null ? '' : this.company.phone, Validators.required)
    });

    this.addressAutocomplete();
  }
  loadCompanyImages()
  {
    this.imageService.getCompanyImages(this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.showPageMessage('error', 'Error', gro.error);
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
      }
      else
      {
        if (gro.objList.length > 0)
        {
          this.images = <Image[]>gro.objList;
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company images', ''));
  }
  reloadCompany()
  {
    this.companyService.getCompany(this.usersService.getCurrentUser().id, this.idCompany).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.showPageMessage('error', 'Error', gro.error);
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
      }
      else
      {
        if (gro.objList.length > 0)
        {
          this.company = <Company>gro.objList[0];
          this.loadCategories(this.company.idCategory);
          if (this.company.lat != null)
          {
            let gmap = this.map.getMap();
            gmap.setOptions({
              center: { lat: this.company.lat, lng: this.company.lng },
              zoom: 18
            });
            this.gMapOverlays = [];
            this.gMapOverlays.push(new google.maps.Marker({ position: { lat: this.company.lat, lng: this.company.lng }, draggable: true }))
          }
          this.initForm();
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company', ''));
  }
  reloadCompanySpecialDays()
  {
    this.specialDays = [];
    this.companyService.getCompanySpecialDays(this.idCompany, null).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        let sd: SpecialDay[] = <SpecialDay[]>gro.objList;
        for (var i = 0; i < sd.length; i++)
        {
          this.specialDays.push({
            "id": sd[i].id.toString(),
            "title": this.getCurrentLabelValue('lblSpecialDay'),
            "allDay": true,
            "start": sd[i].day,
            "color": "#ff4d4d"
          });
          if (sd[i].isEveryYear)
          {
            for (var j = -50; j < 51; j++)
            {
              if (j != 0)//sarim peste data curenta care este deja adaugata
              {
                let reccruringDate = new Date(sd[i].day);
                let year = reccruringDate.getFullYear();
                reccruringDate.setFullYear(year + j);

                this.specialDays.push({
                  "id": sd[i].id.toString(),
                  "title": this.getCurrentLabelValue('lblSpecialDay'),
                  "allDay": true,
                  "start": reccruringDate,
                  "color": "#ff4d4d"
                });
              }
            }
          }
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company special days', ''));
  }
  onSaveForm()
  {
    try
    {
      this.company.name = this.genDetailsForm.controls['name'].value;
      this.company.description = this.genDetailsForm.controls['description'].value;
      this.company.idCategory = this.genDetailsForm.controls['category'].value;
      this.company.idSubcategory = this.genDetailsForm.controls['subcategory'].value;
      this.company.idCountry = this.genDetailsForm.controls['country'].value;
      this.company.town = this.genDetailsForm.controls['town'].value;
      this.company.address = this.genDetailsForm.controls['address'].value;
      this.company.email = this.genDetailsForm.controls['email'].value;
      this.company.phone = this.genDetailsForm.controls['phone'].value;

      //se pun null ca se se updateze doar cele de sus
      this.company.lat = null;
      this.company.lng = null;

      this.companyService.updateCompany(this.company).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
        {
          this.showPageMessage('error', 'Error', gro.error);
          this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed);
        }
        else
        {
          this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblSaved'));
          this.logAction(this.idCompany, false, Actions.Edit, '', '');
        }
      });
    }
    catch (ex)
    {
      this.logAction(this.idCompany, true, Actions.Edit, ex.message, 'error editing company');
      this.showPageMessage('error', 'Error', ex.message);
    }
  }
  loadCountriesDic()
  {
    this.countries = [];
    this.countriesService.getCountries().subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
      else
      {
        this.countriesDic = <Country[]>gro.objList;
        for (var i = 0; i < this.countriesDic.length; i++)
        {
          this.countries.push({ label: this.countriesDic[i].name_Formatted, value: this.countriesDic[i].id });
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error loading countries dictionary', ''));
  }
  getCountryObj(idCountry: number): Country
  {
    for (var i = 0; i < this.countriesDic.length; i++)
    {
      if (this.countriesDic[i].id == idCountry)
      {
        return this.countriesDic[i];
      }
    }
  }
  loadCategories(selectedIdCategory: number)
  {
    this.companyService.getActivityCategories().subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.categories = <GenericDictionary[]>gro.objList;
        if (this.categories.length > 0)
        {
          if (selectedIdCategory == null)
            this.loadSubCategories(this.categories[0].id);
          else
            this.loadSubCategories(selectedIdCategory);
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting category types', ''));
  }
  loadSubCategories(idCategory: number)
  {
    this.companyService.getActivitySubCategories(idCategory).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.subcategories = <GenericDictionary[]>gro.objList;
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting subcategory types', ''));
  }

  handleMapClick(event)
  {
    this.gMapOverlays = [];
    let selectedPosition = event.latLng;
    this.gMapOverlays.push(new google.maps.Marker({ position: { lat: selectedPosition.lat(), lng: selectedPosition.lng() }, draggable: true }));

    this.updateCompanyPosition(selectedPosition);
  }
  handleDragEnd(event)
  {
    let selectedPosition = event.overlay.getPosition();
    this.updateCompanyPosition(selectedPosition);
  }
  updateCompanyPosition(selectedPosition: any)
  {
    this.company.lat = selectedPosition.lat();
    this.company.lng = selectedPosition.lng();

    this.companyService.updateCompany(this.company).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.showPageMessage('error', 'Error', gro.error);
        this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed);
      }
      else
      {
        //this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblPositionUpdated'));
        this.logAction(this.idCompany, false, Actions.Edit, '', 'position edit');
      }
    });
  }
  addressAutocomplete()
  {
    let country: Country = this.getCountryObj(this.genDetailsForm.controls['country'].value);

    let searchBox = new google.maps.places.Autocomplete(this.address.nativeElement);
    if (country)
      searchBox.setComponentRestrictions({ 'country': country.isO2.toLowerCase() });


    google.maps.event.addListener(searchBox, 'place_changed', () =>
    {
      let place: google.maps.places.PlaceResult = searchBox.getPlace();

      //verify result
      if (place.geometry === undefined || place.geometry === null)
      {
        return;
      }

      let town: string = '';
      let geocoder: google.maps.Geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'placeId': place.place_id }, (results, status) =>
      {
        if (status == google.maps.GeocoderStatus.OK)
        {
          if (results[0])
          {
            loop1:
            for (var i = 0; i < results[0].address_components.length; i++)
            {
              for (var j = 0; j < results[0].address_components[i].types.length; j++)
              {
                if (results[0].address_components[i].types[j] == 'locality')
                {
                  town = results[0].address_components[i].long_name;
                  this.genDetailsForm.controls['town'].setValue(town);
                  break loop1;
                }
              }
            }
          }
        }
      });


      this.genDetailsForm.controls['address'].setValue(place.formatted_address);

      //set latitude, longitude and zoom
      let latitude = place.geometry.location.lat();
      let longitude = place.geometry.location.lng();

      let selectedPosition = new google.maps.LatLng(latitude, longitude);

      let gmap = this.map.getMap();
      gmap.setOptions({
        center: selectedPosition,
        zoom: 18
      });

      this.gMapOverlays = [];
      this.gMapOverlays.push(new google.maps.Marker({ position: selectedPosition, draggable: true }));
      this.updateCompanyPosition(selectedPosition);
    });
  }
  onUpload(fileInput: any)
  {
    if (this.images.length < 5)
    {
      let fi = fileInput.target;
      if (fi.files && fi.files[0])
      {
        let fileToUpload = fi.files[0];
        this.imageService.uploadCompanyImage(this.idCompany, fileToUpload).subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            if (gro.error.indexOf('size limit') > -1)
              this.showPageMessage('error', 'Error', this.getCurrentLabelValue('lblOnlyOneMBfilesPermitted'));
            else
              this.showPageMessage('error', 'Error', gro.error);

            this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed);
          }
          else
          {
            this.logAction(this.idCompany, false, Actions.Edit, '', 'image upload');
            this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblSaved'));
            this.loadCompanyImages();
          }
        });
      }
    }
    else
    {
      this.showPageMessage('warn', 'Warning', this.getCurrentLabelValue('lblOnlyFiveImagesPermitted'));
    }
  }
  onImageClick(image: Image)
  {
    this.selectedImage = image;
    this.displayImageDialog = true;
  }
  deleteImage()
  {
    this.imageService.deleteCompanyImage(this.selectedImage.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;

      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, '', 'delete company image');
        this.showPageMessage('success', 'Success', '');
        this.loadCompanyImages();
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Delete, 'http error deleting company image', ''));

    this.displayImageDialog = false;
  }
  onChangeCategory(event)
  {
    this.loadSubCategories(event.target.value);
  }
  onUpdateWorkingHours(value: WorkingHours)
  {
    this.workingHours = value;
    this.companyService.updateCompanyWorkingHours(this.workingHours).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Edit, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Edit, '', 'edit company working hours');
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Edit, 'http error updating company working hours', ''));
  }

  onDayClick(event)
  {
    this.selectedDate = event;//.date._d;
    this.selectedWeekDayIndex = this.convertWeekDayIndex(event.getDay());//.date._d.getDay());
    this.displayDialog = true;

    this.getExistingSpecialDayEvent(event);//.date._d);

    //this.cd.detectChanges();
  }
  onEventClick(event)
  {
    this.selectedDate = new Date(event.start);//.calEvent._start._d;
    this.selectedWeekDayIndex = this.convertWeekDayIndex(new Date(event.start).getDay());//.calEvent._start._d.getDay());
    this.displayDialog = true;

    this.getExistingSpecialDayEvent(new Date(event.start));//.calEvent._start._d);
  }
  onEventDrop(event)
  {
    //trebuie verificat daca nu exista deja special day la noua data si atunci nu schimbam nimic si afisam mesaj
    //trebuie facuta optiune de remove special day
    this.companyService.getCompanySpecialDays(this.idCompany, new Date(event.event.start)).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
      }
      else
      {
        let sd: SpecialDay[] = <SpecialDay[]>gro.objList;
        if (sd.length > 0)
        {
          this.showPageMessage('warn', 'Warning', this.getCurrentLabelValue('lblSelectedDayAlreadySpecial'));
          this.reloadCompanySpecialDays();
        }
        else
        {
          this.updateSpecialDayAfterDrop(new Date(event.originDate), new Date(event.targetDate));
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company special days', ''));
  }
  getExistingSpecialDayEvent(date: Date)
  {
    this.companyService.getCompanySpecialDays(this.idCompany, date).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        let sd: SpecialDay[] = <SpecialDay[]>gro.objList;
        if (sd.length > 0)
        {
          this.selectedSpecialDay = sd[0];
          this.selectedSpecialDayWorkingHoursString = sd[0].workingHours;
          this.isRepeatEveryYear = sd[0].isEveryYear;

          this.specialDayWorkingHours = new WorkingHours(0, this.idCompany, '',
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null));
          if (this.selectedWeekDayIndex == 0) { this.specialDayWorkingHours.monday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 1) { this.specialDayWorkingHours.tuesday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 2) { this.specialDayWorkingHours.wednesday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 3) { this.specialDayWorkingHours.thursday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 4) { this.specialDayWorkingHours.friday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 5) { this.specialDayWorkingHours.saturday.workHours = this.selectedSpecialDay.workingHours; }
          if (this.selectedWeekDayIndex == 6) { this.specialDayWorkingHours.sunday.workHours = this.selectedSpecialDay.workingHours; }

          this.cd.detectChanges();
        }
        else
        {
          //resetam toate variabilele
          this.isRepeatEveryYear = false;
          this.specialDayWorkingHours = new WorkingHours(0, this.idCompany, '',
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null),
            new WorkingDay('', null));
          this.selectedSpecialDayWorkingHoursString = '';

          this.selectedSpecialDay = new SpecialDay(0, this.idCompany, this.selectedDate, this.isRepeatEveryYear,
            this.selectedSpecialDayWorkingHoursString);
        }
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company special days', ''));
  }
  onUpdateWorkingHoursSpecialDay(value: WorkingHours)
  {
    let hoursIntervalString = ''
    if (this.selectedWeekDayIndex == 0) { hoursIntervalString = value.monday.workHours; }
    if (this.selectedWeekDayIndex == 1) { hoursIntervalString = value.tuesday.workHours; }
    if (this.selectedWeekDayIndex == 2) { hoursIntervalString = value.wednesday.workHours; }
    if (this.selectedWeekDayIndex == 3) { hoursIntervalString = value.thursday.workHours; }
    if (this.selectedWeekDayIndex == 4) { hoursIntervalString = value.friday.workHours; }
    if (this.selectedWeekDayIndex == 5) { hoursIntervalString = value.saturday.workHours; }
    if (this.selectedWeekDayIndex == 6) { hoursIntervalString = value.sunday.workHours; }

    this.selectedSpecialDayWorkingHoursString = hoursIntervalString;
  }
  saveSpecialDay()
  {
    try
    {
      let isAdd = (this.selectedSpecialDay.id == 0 ? true : false);

      this.selectedSpecialDay.workingHours = this.selectedSpecialDayWorkingHoursString;
      this.selectedSpecialDay.isEveryYear = this.isRepeatEveryYear;
      this.selectedSpecialDay.day = this.selectedDate;


      this.companyService.setCompanySpecialDays(isAdd, this.selectedSpecialDay)
        .subscribe(result =>
        {
          let gro = <GenericResponseObject>result;
          if (gro.error != '')
          {
            this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed);
            this.showPageMessage('error', 'Error', gro.error);
          }
          else
          {
            this.logAction(this.idCompany, false, Actions.Add, '', 'saved company special day');
            this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblSaved'));
          }
          this.reloadCompanySpecialDays();
        },
          err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding company special day', '')
        );
    }
    catch (ex)
    {
      this.logAction(this.idCompany, true, Actions.Add, ex.message, '');
      this.showPageMessage('error', 'Error', ex.message);
      this.reloadCompanySpecialDays();
    }

    this.displayDialog = false;
  }
  updateSpecialDayAfterDrop(initialDate: Date, newDate: Date)
  {
    try
    {
      this.companyService.getCompanySpecialDays(this.idCompany, initialDate).subscribe(result =>
      {
        let gro = <GenericResponseObject>result;
        if (gro.error != '')
        {
          this.logAction(this.idCompany, true, Actions.Search, gro.error, gro.errorDetailed);
          this.showPageMessage('error', 'Error', gro.error);
        }
        else
        {
          let sd: SpecialDay[] = <SpecialDay[]>gro.objList;
          this.selectedSpecialDay = sd[0];
          this.selectedSpecialDay.day = newDate;

          this.companyService.setCompanySpecialDays(false, this.selectedSpecialDay)
            .subscribe(result =>
            {
              let gro = <GenericResponseObject>result;
              if (gro.error != '')
              {
                this.logAction(this.idCompany, true, Actions.Add, gro.error, gro.errorDetailed);
                this.showPageMessage('error', 'Error', gro.error);

              }
              else
              {
                this.logAction(this.idCompany, false, Actions.Add, '', 'saved company special day');
                this.showPageMessage('success', 'Success', this.getCurrentLabelValue('lblSaved'));
              }
              this.reloadCompanySpecialDays();
            },
              err => this.logAction(this.idCompany, true, Actions.Add, 'http error adding company special day', ''));
        }
      },
        err => this.logAction(this.idCompany, true, Actions.Search, 'http error getting company special days', ''));
    }
    catch (ex)
    {
      this.logAction(this.idCompany, true, Actions.Add, ex.message, '');
      this.showPageMessage('error', 'Error', ex.message);
      this.reloadCompanySpecialDays();
    }
  }
  removeSpecialDay()
  {
    this.companyService.deleteCompanySpecialDay(this.selectedSpecialDay.id).subscribe(result =>
    {
      let gro = <GenericResponseObject>result;
      if (gro.error != '')
      {
        this.logAction(this.idCompany, true, Actions.Delete, gro.error, gro.errorDetailed);
        this.showPageMessage('error', 'Error', gro.error);
      }
      else
      {
        this.logAction(this.idCompany, false, Actions.Delete, '', 'deleted company special day');
        this.showPageMessage('success', 'Success', '');
        this.reloadCompanySpecialDays();
      }
    },
      err => this.logAction(this.idCompany, true, Actions.Delete, 'http error deleting company special day', ''));

    this.displayDialog = false;
  }
  convertWeekDayIndex(jsIndex)
  {
    let normalIndex = 0;
    if (jsIndex == 1) { normalIndex = 0; }//monday
    if (jsIndex == 2) { normalIndex = 1; }//tuesday
    if (jsIndex == 3) { normalIndex = 2; }//wednesday
    if (jsIndex == 4) { normalIndex = 3; }//thursday
    if (jsIndex == 5) { normalIndex = 4; }//friday
    if (jsIndex == 6) { normalIndex = 5; }//saturday
    if (jsIndex == 0) { normalIndex = 6; }//sunday

    return normalIndex;
  }
}
