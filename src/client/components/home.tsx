import { Component, React, bind, KeyValuePair } from 'chen-react';

export interface HomeProps {}

export interface HomeState {
  rentals?: any[];
  count?: number;
  pageCount?: number;
  minRent?: number;
  maxRent?: number;
  beds?: string;
  bath?: string;
  page?: number;
  more?: boolean;
  loading?: boolean;
}

declare var google;

export class Home extends Component<HomeProps, HomeState> {

  private mapDiv: HTMLDivElement;
  private gMap;
  private markers: KeyValuePair<any> = {};

  constructor(props: HomeProps, context) {
    super(props, context);

    this.state = { loading: true };
  }

  getRentals() {

    this.setState({ loading: true });

    $.ajax({
      url: '/rentals',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      },
      data: {
        max_rent: this.state.maxRent,
        min_rent: this.state.minRent,
        beds: this.state.beds,
        bath: this.state.bath,
        page: this.state.page
      }
    }).done((res) => {
      if (res.data) {
        this.setState({ loading: false, rentals: res.data, count: res.count, pageCount: res.pageCount })
      }
    }).fail((err) => {
      this.setState({ loading: false })
    });
  }

  componentDidMount() {
    this.gMap = new google.maps.Map(this.mapDiv, {
      zoom: 12,
      center: {lat: 37.7227707, lng: -122.424672}
    });

    this.getRentals();
  }

  componentDidUpdate(props: HomeProps, state: HomeState) {
    if (this.state.rentals && this.state.rentals.length && this.state.rentals != state.rentals) {
      this.state.rentals.map(rent => {
        if (this.markers[rent['id']]) {
          this.markers[rent['id']].setMap(null);
          this.markers[rent['id']] = new google.maps.Marker({
            position: JSON.parse(rent['geoLocation']),
            map: this.gMap
          });
        } else {
          this.markers[rent['id']] = new google.maps.Marker({
            position: JSON.parse(rent['geoLocation']),
            map: this.gMap
          });
        }
      });
    }
  }


  getPagination() {
    let buttons = [];
    for (let x = 0; x < this.state.pageCount; x++) {
      buttons.push(<span key={x}>
        <button className="btn" onClick={e => this.setState({ page: x + 1 }, () => this.getRentals())}>{x + 1}</button>&nbsp;
      </span>);
    }

    return <div>
      <hr />
      {this.state.count} Results {buttons}<br/><br/>
    </div>
  }

  @bind()
  selectMin(e) {
    this.setState({ minRent: e.target.value }, () => this.getRentals());
  }

  @bind()
  selectMax(e) {
    this.setState({ maxRent: e.target.value }, () => this.getRentals());
  }

  selectBed(val) {
    this.setState({ beds: val }, () => this.getRentals());
  }

  selectBath(val) {
    this.setState({ bath: val }, () => this.getRentals());
  }

  @bind()
  clearFilter() {
    this.setState({ beds: null, minRent: null, maxRent: null, page: null }, () => this.getRentals());
  }

  @bind()
  moreFilter() {
    this.setState({ more: !this.state.more });
  }

  public render() {

    let maxOptions = [], minOptions = [];
    for (let x = 0; x < 10; x++) {
      let val = (x+1) * 1000;

      if (!this.state.minRent || this.state.minRent < val) {
        maxOptions.push(<option key={val} value={`${val}`}>${val}</option>);
      }
      if (!this.state.minRent || this.state.minRent < (val + 500)) {
        maxOptions.push(<option key={val + 500} value={`${val + 500}`}>${val + 500}</option>);
      }

      if (!this.state.maxRent || this.state.maxRent > val) {
        minOptions.push(<option key={val} value={`${val}`}>${val}</option>);
      }
      if (!this.state.maxRent || this.state.maxRent > val + 500) {
        minOptions.push(<option key={val + 500} value={`${val + 500}`}>${val + 500}</option>);
      }
    }

    let beds = ['1', '2', '3', '4', '5+'];

    return <div style={{ padding: '10px' }}>
      <div className="col-md-7">
        <h2>San Francisco Bay Area Rental Property Listings</h2>
        <form>
          <div className="row">
            <div className="col-md-1">
              <span className="fa fa-filter fa-4x" aria-hidden="true"></span>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="max-rent">Min Rent</label>
                <select id="max-rent" className="form-control" value={`${this.state.minRent}`} onChange={this.selectMin}>
                  <option value={null}>Choose ...</option>
                  {minOptions}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="min-rent">Max Rent</label>
                <select id="min-rent" className="form-control" value={`${this.state.maxRent}`} onChange={this.selectMax}>
                  <option value={null}>Choose ...</option>
                  {maxOptions}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Beds</label><br/><br/>
                <div>
                  {beds.map(val => {
                    let cls = 'btn btn-xs';
                    if (this.state.beds == val) {
                      cls = 'btn btn-xs btn-danger'
                    }

                    return <span key={val}>
                      <button type="button" onClick={e => this.selectBed(val)} className={cls}>{val}</button>&nbsp;
                    </span>
                  })}
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                {this.state.beds || this.state.bath || this.state.maxRent || this.state.minRent ?
                <button type="button" onClick={this.clearFilter} className="btn btn-warning">Clear</button>
                : null}
                <button type="button" onClick={this.moreFilter} className="btn btn-{this.state.more ?'normal':'danger'}"> {this.state.more ? 'Close' : 'More'}</button>
                <br/><br/><br/><br/>
              </div>
            </div>
            {this.state.more ? <div className="col-md-1">&nbsp;</div> :null}
            {this.state.more ?
            <div className="col-md-3">
              <div className="form-group">
                <label>Baths</label><br/><br/>
                <div>
                  {beds.map(val => {
                    let cls = 'btn btn-xs';
                    if (this.state.bath == val) {
                      cls = 'btn btn-xs btn-danger';
                    }

                    return <span key={val}>
                      <button type="button" onClick={e => this.selectBath(val)} className={cls}>{val}</button>&nbsp;
                    </span>
                  })}
                </div>
              </div>
            </div>
            : null}
          </div>
        </form>

        {this.state.loading ?
        <div className="alert alert-info"><i className="fa fa-spin fa-spinner"></i> Loading ...</div>
        : null}

        {this.state.rentals && this.state.rentals.length ?
          <div>
            {this.getPagination()}
            <div>
              {this.state.rentals.map(rental => {
                let loc = JSON.parse(rental['geoLocation']);
                return <div className="col-md-6" key={rental['id']} style={{ padding: '10px' }}>
                  <img height="250px" src={`https://maps.googleapis.com/maps/api/streetview?location=${loc['lat']},${loc['lng']}&size=1280x720&fov=90&key=AIzaSyAp2FJJJNV6peSh8vHfXxb680UQZh7f33E`} width="100%" />
                  {rental['address']} {rental['city']}
                  <span className="pull-right">
                    {rental['targetRent'] ?
                      <span color="green">${rental['targetRent']}</span> :
                      <i color="blue">Coming Soon!</i>}
                  </span><br/>
                  {rental['bedCount']} bed{rental['bedCount'] > 1 ? 's' : ''}, &nbsp;
                  {rental['bathroomCount']} bath{rental['bathroomCount'] > 1 ? 's' : ''},  &nbsp;
                  {rental['totalArea']} sqft,  &nbsp;
                  {rental['minimumCreditStore']} credit &nbsp;
                </div>
              })}
            </div>
            {this.getPagination()}
          </div>
        : null}
      </div>
      <div className="col-md-5">
        <div style={{ position: 'fixed', right: 0, top: '52px', width: '500px' }}>
          <div style={{ height: 'calc(100vh - 52px)' }} ref={e => this.mapDiv = e}></div>
        </div>
      </div>
    </div>
  }
}
