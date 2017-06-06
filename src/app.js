const bootstrap = require('./bootstrap.scss');
const bootstrapTheme = require('./bootstrap-theme.scss');
const css = require('./app.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactStars from './modules/react-stars';
import axios from 'axios';
import moment from 'moment';
import FaCheck from 'react-icons/lib/fa/check';
import starSvg from "./images/star-full.svg";

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

			componentWillMount() {
				// console.log(this.props);
			};


			handleChange(event) {
				this.setState({value: event.target.value});
			}

			handleSubmit(event) {
				alert('A name was submitted: ' + this.state.value);
				event.preventDefault();
			}

			render() {
				console.log(this.props);
				return <div>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="name">Vertinimas</label>
							<ReactStars count={5} value={1} half={true} size={'25px'} color2={'#ffd700'} onChange={this.handleChange}/>
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
			console.log(props);
		}

		render() {
			this.parent = this._reactInternalInstance._currentElement._owner._instance;
			return (
				<div className="feedback-circle">{this.parent.state.totalRating}</div>
				// <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 512 512">
				// 	<g id={"icomoon-ignore"}>
				// 	</g>
				// 	<path fill={"#ffd700"} stroke={"#ffd700"}
				// 		  d="M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z"></path>
				// 	<text x={"150"} y={"330"} fill={"param(text) black"} style={{fontSize: '140px'}}>{this.parent.state.totalRating}</text>
				// </svg>
			)
		}
	}

	class FeedbackListHeader extends React.Component {

		constructor(props) {
			super(props);

			this.state = {feedbacks: []};
		}

		componentWillMount() {
			axios.get('http://localhost:3000/api/products/totalratingscore?productid=1')
				.then(res => {
					const totalRating = res.data;
					this.setState({totalRating});
				});
			axios.get('http://localhost:3000/api/products/1/feedbacks/count', {
					params: {
						where: {and: [{totalratingscore: {neq: null}}, {approved: 1}]}
					}
				})
				.then(res => {
					const totalFeedbacks = res.data.count;
					this.setState({totalFeedbacks});
				});
		}

		render() {
			return (
				<div className="col-md-4 col-xs-12 rating-header">
					<div className="heading">{title}</div>

					<div style={{paddingBottom: '10px'}} className="col-xs-12">
						<div style={{display: 'inline-block'}}>
							<StarSvgRating/>
						</div>
						<div style={{paddingLeft: '15px',display: 'inline-block',bottom: '6px', position: 'relative'}}>
							<ReactStars count={5} edit={false} value={parseFloat(this.state.totalRating).toFixed(0)} half={true} size={'30px'} color2={'#ffd700'}/>
							<div style={{color: '#9b999a', paddingLeft: '5px'}}>
								{this.state.totalFeedbacks} atsiliepimai
							</div>
						</div>
					</div>
				</div>
			);

		}
	}

	class FeedbackList extends React.Component {

		constructor(props) {
			super(props);
			this.state = {feedbacks: [], displayWidget: false};
		}

		// async componentDidMount() {
		// 	const firstRequest = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?&address=' + this.props.p1);
		// 	const secondRequest = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?&address=' + this.props.p2);
		// 	const thirdRequest = await axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=place_id:' + firstRequest.data.results.place_id + '&destination=place_id:' + secondRequest.data.results.place_id + '&key=' + 'API-KEY-HIDDEN');
		//
		// 	this.setState({
		// 		p1Location: firstRequest.data,
		// 		p2Location: SecondRequest.data,
		// 		route: thirdRequest.data,
		// 	});
		// }

		componentWillMount() {

			axios.get('http://localhost:3000/api/clients/1').then(res => {
				const client = res.data;
				var displayWidget = client.displaywidget;
				this.setState({displayWidget});
				console.log('client');
				console.log(client);
				// if (client.displaywidget) {
				//
				// }
			});

			if (this.state.displayWidget) {
				axios.get('http://localhost:3000/api/products/1/feedbacks/count', {
						params: {
							where: {and: [{totalratingscore: {neq: null}}, {approved: 1}]}
						}
					})
					.then(res => {
						const feedbackCount = res.data.count;
						this.setState({feedbackCount});
					});

				axios.get('http://localhost:3000/api/products/1/feedbacks', {
						params: {
							filter: {
								where: {and: [{totalratingscore: {neq: null}}, {approved: 1}]},
								include: 'customer'
							}

						}
					})
					.then(res => {
						const feedbacks = res.data;
						this.setState({feedbacks});
					});
			}
		}

		componentDidMount() {

		}

		render() {
			console.log(this.state);
			// if (this.state.client.displaywidget) {
			console.log(this.state.displayWidget);
			console.log('adasd');
			if (this.state.displayWidget) {
				const feedbackCount = this.state.feedbackCount;
				const feedbacks = this.state.feedbacks.map((item, i) => {
					return <div className="feedback-list-block">
						<div className="user-block col-xs-3">
							<div className="user-name feedback-circle">
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
							<div className="pull-left feedback-headline ">{item.commentheader}</div>
							<div className="pull-left ">
								<ReactStars count={5} edit={false} size={'25px'} value={parseFloat(item.totalratingscore).toFixed(0)} color2={'#ffd700'}/>
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
						<FeedbackListHeader />
						<div className="col-xs-12 col-md-8 rating-list">
							<div className="feedback-list-container">{feedbacks}</div>

						</div>
					</div>
				);
			} else {
				return false;
			}

			// }

		}
	}

	// class FeedbackBlock extends React.Component {
	//
	//
	// 	render() {
	// 		const feedbacks = this.state.feedbacks.map((item, i) => {
	// 			return <div>
	// 				<strong>{item.name}</strong>
	// 				<span> {item.approved ? 'Patvirtintas pirkėjas' : 'Nepatvirtintas pirkėjas'}</span>
	// 				<div>
	// 					<ReactStars count={5} edit={false} size={25} value={5} color2={'#ffd700'}/>
	// 				</div>
	// 				<h5>{item.commentheader}</h5>
	// 				<p>{item.commentcontent}</p>
	// 			</div>
	// 		});
	//
	// 		// const rating = this.props.feedback.rating;
	//
	// 		return (
	// 			<div>
	// 				{feedbacks}
	// 			</div>
	// 		);
	// 	}
	// }
	ReactDOM.render(
		<FeedbackList/>,
		feedbackListDom
	);

}




