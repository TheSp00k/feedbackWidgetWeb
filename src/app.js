const bootstrap = require('./bootstrap.scss');
const bootstrapTheme = require('./bootstrap-theme.scss');
const css = require('./app.scss');

import "babel-polyfill";
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ReactStars from './modules/react-stars';
import axios from 'axios';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { Line } from 'rc-progress';
import MdClose from 'react-icons/lib/md/close';


let apiUrl;
if (process.env.NODE_ENV == "production") {
	apiUrl = 'http://52.211.101.202:3001';
} else {
	apiUrl = 'http://localhost:3000';
}

var feedbackListDom = document.getElementById('feedback-widget-list');

if (feedbackListDom) {
	const headingTitle = 'ATSILIEPIMAI', formTitle = 'RAŠYTI ATSILIEPIMĄ';

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

		filterFeedbacks(stars, reset) {
			this.props.filterFeedbacks(stars ? {totalratingscore: stars} : null, reset);
		}

		starPercent(count) {
			let totalFeedbacks = this.props.totalFeedbacks;
			return Math.round((count/totalFeedbacks) * 100);
		}

		render() {
			if (this.props.totalRating && this.props.totalFeedbacks) {
				return (
					<div className="rating-header">
						<div className="filter-part">
							<div className="heading">{headingTitle}</div>
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
								<table className="rating-filter-table" style={{border: 'none', fontSize: '14px'}}>
									<tbody>
									<tr onClick={() => this.filterFeedbacks(5)} className="rating-row">
										<td className="part-1">5 žv.</td>
										<td className="part-2"><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['5'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
										<td className="part-3">{this.props.starTotals['5']}</td>
									</tr>
									<tr onClick={() => this.filterFeedbacks(4)} className="rating-row">
										<td className="part-1">4 žv.</td>
										<td className="part-2"><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['4'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
										<td className="part-3">{this.props.starTotals['4']}</td>
									</tr>
									<tr onClick={() => this.filterFeedbacks(3)} className="rating-row">
										<td className="part-1">3 žv.</td>
										<td className="part-2"><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['3'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
										<td className="part-3">{this.props.starTotals['3']}</td>
									</tr>
									<tr onClick={() => this.filterFeedbacks(2)} className="rating-row">
										<td className="part-1">2 žv.</td>
										<td className="part-2"><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['2'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
										<td className="part-3">{this.props.starTotals['2']}</td>
									</tr>
									<tr onClick={() => this.filterFeedbacks(1)} className="rating-row">
										<td className="part-1">1 žv.</td>
										<td className="part-2"><Line style={{width: '100%',height: '20px', maxWidth: '145px'}} percent={this.starPercent(this.props.starTotals['1'])} strokeWidth="4" trailWidth="4" trailColor="#f2f2f2" strokeLinecap="square" strokeColor={this.props.client.themecolor} /></td>
										<td className="part-3">{this.props.starTotals['1']}</td>
									</tr>
									{ this.props.starsSelected &&
									<tr onClick={() => this.filterFeedbacks(null, true)} className="rating-row">
										<td style={{paddingTop: '10px', fontWeight: 600, color: 'rgb(181, 179, 180)', paddingBottom: '20px'}} colSpan="3">Žiūrėti visus atsiliepimus</td>
									</tr>
									}
									</tbody>
								</table>
							</div>
						</div>
						<div className="leave-feedback-part">
							<button style={{margin: '15px 10px'}} onClick={this.props.showFeedbackForm} className="leave-feedback-btn">Rašyti atsiliepimą</button>
						</div>
					</div>
				);
			} else {
				return false;
			}
		}
	}

	class FeedbackFrom extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				form: {
					totalratingscore: null,
					commentcontent: null,
					customer: {
						email: null
					}
				},
				thankyouSlideActive: false,
				ratingError: null,
				commentContentError: null,
				emailError: null
			};
			this.handleChange = this.handleChange.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);
		};
		handleChange(field, parent, e) {
			if (parent) {
				this.state.form[parent][field] = e.target.value;
			} else {
				this.state.form[field] = e.target ? e.target.value : e;
			}
		};

		validateForm() {
			let formValid = true;
			let commentContentError = null;
			let ratingError = null;
			let emailError = null;

			if (!this.state.form.commentcontent || this.state.form.commentcontent == '') {
				commentContentError = 'Šis laukas yra privalomas';
				formValid = false;
			}
			if (!this.state.form.totalratingscore || this.state.form.totalratingscore == 0) {
				ratingError = 'Šis laukas yra privalomas';
				formValid = false;
			}

			const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			let valid = emailRe.test(this.state.form.customer.email);
			if (!this.state.form.customer.email || this.state.form.customer.email == '') {
				emailError = 'Šis laukas yra privalomas';
				formValid = false;
			} else if (!valid) {
				emailError = 'Neteisingas elektroninio pašto adresas';
				formValid = false;
			}
			this.setState({commentContentError: commentContentError, ratingError: ratingError, emailError: emailError});
			return formValid;
		};

		handleSubmit(event) {
			event.preventDefault();
			let formValid = this.validateForm();
			if (!formValid) {
				return;
			}
			const photourl = feedbackListDom.getAttribute('data-photourl');
			const name = feedbackListDom.getAttribute('data-name');

			axios.post(`${apiUrl}/feedbacks/sendfeedbackfromwidget`, {
				clientid: this.props.clientId,
				productnumber: this.props.productnumber,
				commentcontent: this.state.form.commentcontent,
				totalratingscore: this.state.form.totalratingscore,
				name: name,
				photourl: photourl,
				customer: {
					email: this.state.form.customer.email
				}
			}).then((response) => {
				this.setState({thankyouSlideActive: true});
			}).catch((err) => {
				console.log(err);
			});
		};

		render() {
			return (
				<div className="feedback-form">
					<div className="heading">{formTitle}</div>
					<div className="form-container">
						{this.state.thankyouSlideActive &&
							<div style={{color: this.props.themecolor}} className="thankyou-slide">
								<div onClick={this.props.showFeedbackForm} className="closeForm"><MdClose/></div>
								<div>Ačiū, už atsiliepimą!</div>
							</div>
						}
						<form onSubmit={this.handleSubmit}>
							<div className={"form-group " + (this.state.ratingError ? 'error-label' : '')}>
								<div className="form-label">*Reitingas:</div>
								<ReactStars count={5} onChange={(e) => this.handleChange('totalratingscore', null, e)} half={true} size={'30px'} color1={'#c2c2c2'} color2={'#ffd700'}/>
								<span className="error-text">{this.state.ratingError}</span>
							</div>
							<div className={"form-group " + (this.state.commentContentError ? 'error-label' : '')}>
								<div className={"form-label"} htmlFor="commentcontent">*Atsiliepimas:</div>
								<textarea name="commentcontent" onChange={(e) => this.handleChange('commentcontent', null, e)} id="commentcontent"/>
								<span className="error-text">{this.state.commentContentError}</span>
							</div>
							<div className={"form-group " + (this.state.emailError ? 'error-label' : '')}>
								<div className="form-label" htmlFor="email">*El. pašto adresas:</div>
								<input onChange={(e) => this.handleChange('email', 'customer', e)} id="email" type="text"/>
								<span className="error-text">{this.state.emailError}</span>
							</div>
							<button type="submit" className="leave-feedback-btn pull-right">Siųsti</button>
							<div className="clearfix"></div>
						</form>
					</div>
				</div>
			)
		}
	}

	class FeedbackList extends React.Component {
		constructor(props) {
			super(props);
			const appId = feedbackListDom.getAttribute('data-appid');
			this.state = {formVisible: false, offset: 0, perPage: 10, countForPaging: null, feedbacks: [], clientId: null, accessToken: localStorage.getItem(`${appId}Token`), client: {}, productId: null, product: null, summary: null};
			this.handlePageClick = this.handlePageClick.bind(this);
			this.loadFeedbacks = this.loadFeedbacks.bind(this);
			this.showFeedbackForm = this.showFeedbackForm.bind(this);
		};

		showFeedbackForm() {
			if (this.state.formVisible) {
				this.setState({formVisible: false});
			} else {
				this.setState({formVisible: true});
			}
		};

		authenticate() {
			const domain = window.location.hostname;
			const appId = feedbackListDom.getAttribute('data-appid');
			let authParams = {appid: appId, domain: domain, restriction: 'none'};
			authParams.accesstoken = null;
			if (this.state.accessToken) {
				authParams.accesstoken = this.state.accessToken;
			}
			this.setState({appId, appId});
			return axios.get(`${apiUrl}/clients/authappid`, {
				params: authParams
			});
		};

		loadFeedbacks(filter, reset) {
			let ratingScoreFilter = {neq: null};
			if ((filter && filter.totalratingscore) || reset) {
				ratingScoreFilter = filter ? filter.totalratingscore : ratingScoreFilter;
				this.state.offset = 0;
				axios.get(`${apiUrl}/products/${this.state.productId}/feedbacks?access_token=${this.state.accessToken}`, {
					params: {
						filter: {
							where: {and: [{clientid: this.state.client.id}, {totalratingscore: ratingScoreFilter}, {approved: 1}]},
							include: 'customer',
							limit: this.state.perPage,
							skip: this.state.offset
						}
					}
				}).then((feedbacks) => {
					this.setState({feedbacks: feedbacks.data});
					this.setState({summary: filter ? {selectedStars: filter.totalratingscore} : null });
					this.setState({starsSelected: filter ? filter.totalratingscore : null});
					this.setState({countForPaging: null});
				});
			} else {
				this.setState({starsSelected: false});
				return axios.get(`${apiUrl}/products/${this.state.productId}/feedbacks?access_token=${this.state.accessToken}`, {
					params: {
						filter: {
							where: {and: [{clientid: this.state.client.id}, {totalratingscore: ratingScoreFilter}, {approved: 1}]},
							include: 'customer',
							limit: this.state.perPage,
							skip: this.state.offset
						}
					}
				})
			}
		};
		getClient() {
			return axios.get(`${apiUrl}/clients/${this.state.clientId}?access_token=${this.state.accessToken}`);
		}

		getProduct(productId) {
			return axios.get(`${apiUrl}/products?access_token=${this.state.accessToken}`, {
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
		}

		getTotalFeedbacks() {
			return axios.get(`${apiUrl}/products/${this.state.productId}/feedbacks/count?access_token=${this.state.accessToken}`, {
				params: {where: {and: [{totalratingscore: {neq: null}}, {approved: 1}]}}
			});
		}

		getTotals() {
			return axios.get(`${apiUrl}/products/totals?productid=${this.state.productId}&access_token=${this.state.accessToken}`);
		}

		componentWillMount() {
			const productId = feedbackListDom.getAttribute('data-productid');
			this.setState({productId: productId});
			this.authenticate()
				.then((access) => {
					if (access.data.id) {
						this.setState({accessToken: access.data.id});
						this.setState({clientId: access.data.clientid});
						localStorage.setItem(`${this.state.appId}Token`, access.data.id);
					}
					axios.all([this.getClient(), this.getProduct(productId)])
						.then((results) => {
							this.setState({client: results[0].data, product: results[1].data[0], productId: results[1].data[0].id});
							let feedbacks = [];
							if (this.state.client.displaywidget) {
								axios.all([this.loadFeedbacks(), this.getTotalFeedbacks(), this.getTotals()])
									.then((results) => {
										if (results[0].data) {
											this.setState({feedbacks: results[0].data});
											this.setState({summary: null});
											this.setState({starsSelected: false});
											this.setState({countForPaging: null});
										}
										if (results[1].data) {
											this.setState({totalFeedbacks: results[1].data.count});
											this.setState({pageCount: Math.ceil((this.state.countForPaging || results[1].data.count) / this.state.perPage)});
										}
										if (results[2].data) {
											this.setState({totalRating: results[2].data.totalratingscore, starTotals: results[2].data.startotals});
										}
									});
							}
						});
				});
		};


		handlePageClick(data) {
			let selected = data.selected;
			let offset = Math.ceil(selected * 2);

			this.setState({offset: offset}, () => {
				this.loadFeedbacks()
					.then((feedbacks) => {
						this.setState({feedbacks: feedbacks.data});
						this.setState({summary: null});
						this.setState({starsSelected: false});
						this.setState({countForPaging: null});
					});
			});
		};

		render() {
			if (this.state.client.displaywidget) {
				const feedbacks = this.state.feedbacks.map((item, i) => {
					return <div key={i} className="feedback-list-block">
						<div className="user-block">
							<div style={{backgroundColor: this.state.client.themecolor}} className="user-name feedback-circle">
								{item.customer.name && item.customer.surname ? item.customer.name.charAt(0) : item.customer.secretemail.charAt(0)}
							</div>
							<div className="clearfix"></div>
							<div className="user-name">
								{item.customer.name && item.customer.surname ? item.customer.name : item.customer.secretemail} {item.customer.name && item.customer.surname ? item.customer.surname.charAt(0) + '.' : ''}
							</div>
							<div className="feedback-accepted-buyer">
								{item.purchased ? 'Patvirtintas pirkėjas' : 'Nepatvirtintas pirkėjas'}
							</div>
						</div>

						<div className="feedback-rating-block">

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
							<FeedbackListHeader showFeedbackForm={this.showFeedbackForm} totalFeedbacks={this.state.totalFeedbacks} starsSelected={this.state.starsSelected} totalRating={this.state.totalRating} starTotals={this.state.starTotals} filterFeedbacks={this.loadFeedbacks.bind(this)} accessToken={this.state.accessToken} client={this.state.client} productId={this.state.productId}/>
							{
								this.state.formVisible
									? <FeedbackFrom showFeedbackForm={this.showFeedbackForm} clientId={this.state.clientId} themecolor={this.state.client.themecolor} productnumber={this.state.product.productnumber} />
									: null
							}

							<div className="rating-list">
								<div className="feedback-list-container">
									{this.state.summary &&
										<div className="col-xs-12" style={{fontWeight: 600, color: '#b5b3b4', paddingBottom: '20px'}}>
											Rodomi {this.state.summary.selectedStars} žv. komentarai ({this.state.starTotals[this.state.summary.selectedStars]}). <span style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={() => this.loadFeedbacks(null, true)}>Žiūrėti visus ({this.state.totalFeedbacks})</span>
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