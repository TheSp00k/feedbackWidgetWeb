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
							<ReactStars count={5} value={1} size={'25px'} color2={'#ffd700'} onChange={this.handleChange}/>
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
	const title = 'Atsiliepimai';

	class StarSvgRating extends React.Component {

		constructor(props) {
			super(props);
			console.log(props);
		}

		render() {
			this.parent = this._reactInternalInstance._currentElement._owner._instance;
			return (
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 512 512">
					<g id={"icomoon-ignore"}>
					</g>
					<path fill={"#ffd700"} stroke={"#ffd700"}
						  d="M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z"></path>
					<text x={"150"} y={"330"} fill={"param(text) black"} style={{fontSize: '140px'}}>{this.parent.state.totalRating}</text>
				</svg>
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
						where: {totalratingscore: {neq: null}}
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
					<div className="col-xs-12">
						<ReactStars starClass={'col-xs-2'} count={5} edit={false} value={this.state.totalRating} size={'25px'} color2={'#ffd700'}/>
					</div>
					<div className="pull-left">
						<StarSvgRating/>
					</div>
					<div style={{paddingTop: '12px'}} className="col-xs-8">Įvertinimų: {this.state.totalFeedbacks}</div>
				</div>
			);

		}
	}

	class FeedbackList extends React.Component {

		constructor(props) {
			super(props);
			this.state = {feedbacks: []};
		}

		componentWillMount() {

			axios.get('http://localhost:3000/api/products/1/feedbacks/count')
				.then(res => {
					const feedbackCount = res.data.count;
					this.setState({feedbackCount});
				});

			axios.get('http://localhost:3000/api/products/1/feedbacks')
				.then(res => {
					const feedbacks = res.data;
					this.setState({feedbacks});
				});
		}

		render() {
			console.log(this.state);
			const feedbackCount = this.state.feedbackCount;
			const feedbacks = this.state.feedbacks.map((item, i) => {
				return <div className="feedback-list-block">
					<div className="feedback-rating-block">
						<ReactStars count={5} edit={false} size={'25px'} value={5} color2={'#ffd700'}/>
					</div>
					<div className="feedback-headline">{item.commentheader}</div>
					<div className="feedback-date pull-left">{moment(item.created).format('YYYY-MM-DD')}</div><div className="feedback-accepted-buyer pull-left"> <FaCheck color={"#4caf50"}/> {item.approved ? 'Patvirtintas pirkėjas' : 'Nepatvirtintas pirkėjas'}</div>
					<div className="clearfix"></div>
					<p>{item.commentcontent}</p>
				</div>
			});

			return (
				<div>
					<div>
						<FeedbackListHeader />
					</div>
					<div className="col-xs-12 col-md-8 rating-list">
						<div className="total-feeds">Įvertino klientų sk.: {feedbackCount}</div>
						<div>{feedbacks}</div>
					</div>
				</div>
			);
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




