const bootstrap = require('./bootstrap.scss');
const bootstrapTheme = require('./bootstrap-theme.scss');
const css = require('./app.scss');

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ReactStars from './modules/react-stars';
import axios from 'axios';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { Line } from 'rc-progress';


let apiUrl;
if (process.env.NODE_ENV == "production") {
	apiUrl = '//52.211.101.202:3001';
} else {
	apiUrl = '//localhost:3000';
}


var widgetForm = document.getElementById('feedback-widget-form');
var feedbackListDom = document.getElementById('feedback-widget-list');

if (widgetForm) {
	var disabled = widgetForm.getAttribute('widget-disabled');
	if (disabled) {
		widgetForm.style.display = 'none';
	} else {
		class WidgetFormComponent extends React.Component {

			constructor(props) {
				super(props);
				this.state = {value: ''};
				this.handleChange = this.handleChange.bind(this);
				this.handleSubmit = this.handleSubmit.bind(this);
			}


			handleChange(event) {
				this.setState({value: event.target.value});
			}

			handleSubmit(event) {
				alert('A name was submitted: ' + this.state.value);
				event.preventDefault();
			}

			render() {
				return <div>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="name">Vertinimas</label>
							<ReactStars count={5} value={1} half={true} size={'25px'} color1={'#c2c2c2'} color2={'#ffd700'} onChange={this.handleChange}/>
						</div>
						<div className="form-group">
							<label htmlFor="name">Vardas</label>
							<input id="name" type="text"/>
						</div>
						<div className="form-group">
							<label htmlFor="surname">Pavardė</label>
							<input id="surname" type="text"/>
						</div>
						<div className="form-group">
							<label htmlFor="header">Pavadinimas</label>
							<input id="header" type="text"/>
						</div>
						<div className="form-group">
							<label htmlFor="comment">Detalus aprašymas</label>
							<input id="comment" type="text"/>
						</div>
						<button type="submit" className="btn btn-primary btn-lg">sended</button>
					</form>
				</div>;
			}
		}
		ReactDOM.render(
			<WidgetFormComponent />,
			widgetForm
		);
	}
}

if (feedbackListDom) {
	const title = 'ATSILIEPIMAI';

	class StarSvgRating extends React.Component {
		constructor(props) {
			super(props);
		}
		render() {
			return (
				<div itemProp="ratingValue" style={{backgroundColor: this.props.client.themecolor}} className="feedback-circle">{this.props.totalRating}</div>
			)
		}
	}

	class FeedbackListHeader extends React.Component {
		constructor(props) {
			super(props);
			this.state = {feedbacks: [], totalFeedbacks: null};
			this.filterFeedbacks = this.filterFeedbacks.bind(this);
		}

		// async componentWillMount() {
			// const totals = await axios.get(`${apiUrl}/products/totals?productid=${this.props.productId}&access_token=${this.props.accessToken}`);
			// if (totals) {
			// 	this.setState({totalRating: totals.data.totalratingscore});
			// 	this.setState({starTotals: totals.data.startotals});
			// }
		// };

		filterFeedbacks(stars) {
			this.props.filterFeedbacks({totalratingscore: stars});
		}

		starPercent(count) {
			let totalFeedbacks = this.props.totalFeedbacks;
			return Math.round((count/totalFeedbacks) * 100);
		}

		render() {
			if (this.props.totalRating && this.props.totalFeedbacks) {
				return (
					<div className="col-md-4 col-xs-12 rating-header">
						<div className="heading">{title}</div>
						<div itemProp="aggregateRating" itemScope itemType="http://schema.org/AggregateRating" style={{paddingBottom: '10px'}} className="col-xs-12">
							<div style={{display: 'inline-block'}}>
								<StarSvgRating client={this.props.client} totalRating={this.props.totalRating}/>
							</div>
							<div style={{paddingLeft: '15px',display: 'inline-block',bottom: '6px', position: 'relative'}}>
								<ReactStars count={5} edit={false} value={parseFloat(this.props.totalRating).toFixed(0)} half={true} size={'30px'} color1={'#c2c2c2'} color2={'#ffd700'}/>
								<div style={{color: '#9b999a', paddingLeft: '5px'}}>
									<span itemProp="reviewCount">{this.props.totalFeedbacks}</span> atsiliepimai
								</div>
							</div>
						</div>
						<div className="col-xs-12" style={{fontWeight: 600, color: '#9b999a'}}>
							<table style={{border: 'none'}}>
								<tbody>
								<tr onClick={() => this.filterFeedbacks(5)} className="rating-row">
									<td style={{paddingRight: '10px', verticalAlign: 'top', whiteSpace: 'nowrap'}}>5 žv.</td>
									<td><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['5'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
									<td style={{paddingLeft: '10px', verticalAlign: 'top'}}>{this.props.starTotals['5']}</td>
								</tr>
								<tr onClick={() => this.filterFeedbacks(4)} className="rating-row">
									<td style={{paddingRight: '10px', verticalAlign: 'top', whiteSpace: 'nowrap'}}>4 žv.</td>
									<td><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['4'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
									<td style={{paddingLeft: '10px', verticalAlign: 'top'}}>{this.props.starTotals['4']}</td>
								</tr>
								<tr onClick={() => this.filterFeedbacks(3)} className="rating-row">
									<td style={{paddingRight: '10px', verticalAlign: 'top', whiteSpace: 'nowrap'}}>3 žv.</td>
									<td><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['3'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
									<td style={{paddingLeft: '10px', verticalAlign: 'top'}}>{this.props.starTotals['3']}</td>
								</tr>
								<tr onClick={() => this.filterFeedbacks(2)} className="rating-row">
									<td style={{paddingRight: '10px', verticalAlign: 'top', whiteSpace: 'nowrap'}}>2 žv.</td>
									<td><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['2'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
									<td style={{paddingLeft: '10px', verticalAlign: 'top'}}>{this.props.starTotals['2']}</td>
								</tr>
								<tr onClick={() => this.filterFeedbacks(1)} className="rating-row">
									<td style={{paddingRight: '10px', verticalAlign: 'top', whiteSpace: 'nowrap'}}>1 žv.</td>
									<td><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['1'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
									<td style={{paddingLeft: '10px', verticalAlign: 'top'}}>{this.props.starTotals['1']}</td>
								</tr>
								{ this.props.starsSelected &&
									<tr onClick={() => this.filterFeedbacks()} className="rating-row">
										<td style={{paddingTop: '10px'}} colSpan="3">Žiūrėti visus atsiliepimus</td>
									</tr>
								}
								</tbody>
							</table>
						</div>
					</div>
				);
			} else {
				return false;
			}
		}
	}

	class FeedbackList extends React.Component {

		constructor(props) {
			super(props);
			const appId = feedbackListDom.getAttribute('data-appid');
			this.state = {offset: 0, perPage: 3, countForPaging: null, feedbacks: [], clientId: null, accessToken: localStorage.getItem(`${appId}Token`), client: {}, productId: null, product: null, summary: null};
			this.handlePageClick = this.handlePageClick.bind(this);
			this.loadFeedbacks = this.loadFeedbacks.bind(this);
		};


		async authenticate() {
			const domain = window.location.hostname;
			const appId = feedbackListDom.getAttribute('data-appid');
			let authParams = {appid: appId, domain: domain, restriction: 'none'};
			authParams.accesstoken = null;
			if (this.state.accessToken) {
				authParams.accesstoken = this.state.accessToken;
			}
			let access = await axios.get(`${apiUrl}/clients/authappid`, {
				params: authParams
			});
			if (access.data.id) {

				this.setState({accessToken: access.data.id});
				this.setState({clientId: access.data.clientid});
				localStorage.setItem(`${appId}Token`, access.data.id);
			}
		};


		async loadFeedbacks(filter) {
			let ratingScoreFilter = {neq: null};
			let setSummary = false;
			if (filter && filter.totalratingscore) {
				ratingScoreFilter = filter.totalratingscore;
				setSummary = true;
				this.state.offset = 0;
			} else {
				this.setState({starsSelected: false});
			}
			let feedbacks = await axios.get(`${apiUrl}/products/${this.state.productId}/feedbacks?access_token=${this.state.accessToken}`, {
				params: {
					filter: {
						where: {and: [{clientid: this.state.client.id}, {totalratingscore: ratingScoreFilter}, {approved: 1}]},
						include: 'customer',
						limit: this.state.perPage,
						skip: this.state.offset
					}
				}
			});
			this.setState({feedbacks: feedbacks.data});

			if (setSummary) {
				this.setState({summary: {selectedStars: filter.totalratingscore}});
				this.setState({starsSelected: true});
				this.setState({countForPaging: feedbacks.data.length});
			} else {
				this.setState({summary: null});
				this.setState({starsSelected: false});
				this.setState({countForPaging: null});

			}
		};

		async componentWillMount() {
			const productId = feedbackListDom.getAttribute('data-productid');
			this.setState({productId: productId});

			// const appId = feedbackListDom.getAttribute('data-appid');
			// if (!this.state.accessToken) {
				await this.authenticate();
			// }

			const client = await axios.get(`${apiUrl}/clients/${this.state.clientId}?access_token=${this.state.accessToken}`);
			const product = await axios.get(`${apiUrl}/products?access_token=${this.state.accessToken}`, {
				params: {
					filter: {
						where: {
							and: [
								{clientid: this.state.clientId},
								{productnumber: productId}
							]
						}
					}
				}
			});
			this.setState({client: client.data, product: product.data[0], productId: product.data[0].id});
			let feedbacks = [];
			if (this.state.client.displaywidget) {
				await this.loadFeedbacks();
				const totalFeedbacks = await axios.get(`${apiUrl}/products/${this.state.productId}/feedbacks/count?access_token=${this.state.accessToken}`, {
					params: {where: {and: [{totalratingscore: {neq: null}}, {approved: 1}]}}
				});
				if (totalFeedbacks) {
					this.setState({totalFeedbacks: totalFeedbacks.data.count});
				}
				//TODO pagination and countForPaging bug!!!
				this.setState({pageCount: Math.ceil((this.state.countForPaging || totalFeedbacks.data.count) / this.state.perPage)});
				// this.setState({pageCount: Math.ceil(totalFeedbacks.data.count / this.state.perPage)});
				const totals = await axios.get(`${apiUrl}/products/totals?productid=${this.state.productId}&access_token=${this.state.accessToken}`);
				if (totals) {
					this.setState({totalRating: totals.data.totalratingscore, starTotals: totals.data.startotals});
				}
			}
		};


		handlePageClick(data) {
			let selected = data.selected;
			let offset = Math.ceil(selected * 2);

			this.setState({offset: offset}, () => {
				this.loadFeedbacks();
			});
		};

		render() {
			if (this.state.client.displaywidget) {
				const feedbacks = this.state.feedbacks.map((item, i) => {
					return <div key={i} className="feedback-list-block">
						<div className="user-block col-xs-3">
							<div style={{backgroundColor: this.state.client.themecolor}} className="user-name feedback-circle">
								{item.customer.name.charAt(0)}
							</div>
							<div className="clearfix"></div>
							<div className="user-name">
								{item.customer.name} {item.customer.surname.charAt(0)}.
							</div>
							<div className="feedback-accepted-buyer">
								{item.purchased ? 'Patvirtintas pirkėjas' : 'Nepatvirtintas pirkėjas'}
							</div>
						</div>

						<div className="col-xs-9 feedback-rating-block">

							{this.state.client.showheader &&
							<div className="pull-left feedback-headline ">{item.commentheader}</div>
							}
							<div className="pull-left ">
								<ReactStars count={5} edit={false} size={'25px'} value={parseFloat(item.totalratingscore).toFixed(0)} color1={'#c2c2c2'} color2={'#ffd700'}/>
							</div>
							<div className="clearfix"></div>
							<div className="feedback-text">{item.commentcontent}</div>
							<div className="feedback-date">{moment(item.created).format('YYYY-MM-DD')}</div>
						</div>
						<div className="clearfix"></div>
					</div>
				});
				return (
					<div className="list-root">
						{this.state.totalFeedbacks && this.state.productId &&
						<div>
							<FeedbackListHeader totalFeedbacks={this.state.totalFeedbacks} starsSelected={this.state.starsSelected} totalRating={this.state.totalRating} starTotals={this.state.starTotals} filterFeedbacks={this.loadFeedbacks.bind(this)} accessToken={this.state.accessToken} client={this.state.client} productId={this.state.productId}/>
							<div className="col-xs-12 col-md-8 rating-list">
								<div className="feedback-list-container">
									{this.state.summary &&
										<div className="col-xs-12" style={{fontWeight: 600, color: '#b5b3b4', paddingBottom: '20px'}}>
											Rodomi {this.state.summary.selectedStars} žv. komentarai ({this.state.starTotals[this.state.summary.selectedStars]}). <span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={this.loadFeedbacks}>Žiūrėti visus ({this.state.totalFeedbacks})</span>
										</div>
									}
									{feedbacks}
								</div>
								{(this.state.countForPaging || this.state.totalFeedbacks) > this.state.perPage &&

								<div className="pagination-container">
									<ReactPaginate previousLabel={"ankstesnis"}
												   nextLabel={"kitas"}
												   breakLabel={<a href="">...</a>}
												   breakClassName={"break-me"}
												   pageCount={this.state.pageCount}
												   marginPagesDisplayed={2}
												   pageRangeDisplayed={5}
												   onPageChange={this.handlePageClick}
												   containerClassName={"pagination modal-4"}
												   subContainerClassName={"pages pagination"}
												   activeClassName={"active"}/>
								</div>
								}
							</div>
						</div>
						}
					</div>
				);
			} else {
				return false;
			}
		};
	}
	ReactDOM.render(
		<FeedbackList/>,
		feedbackListDom
	);

}




