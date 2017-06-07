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
		}

		render() {
			return (
				<div className="feedback-circle">{this.props.totalRating}</div>
			)
		}
	}

	class FeedbackListHeader extends React.Component {

		constructor(props) {
			super(props);
			this.state = {feedbacks: [], totalRating: null, totalFeedbacks: null};
		}

		async componentWillMount() {
			const totalRating = await axios.get(`http://localhost:3000/api/products/totalratingscore?productid=${this.props.productId}`);
			if (totalRating) {
				this.setState({totalRating: totalRating.data});
			}
			const totalFeedbacks = await axios.get(`http://localhost:3000/api/products/${this.props.productId}/feedbacks/count`, {
				params: {where: {and: [{totalratingscore: {neq: null}}, {approved: 1}]}}
			});
			if (totalFeedbacks) {
				this.setState({totalFeedbacks: totalFeedbacks.data.count});
			}
		}

		render() {
			if (this.state.totalRating && this.state.totalFeedbacks) {
				return (
					<div className="col-md-4 col-xs-12 rating-header">
						<div className="heading">{title}</div>
						<div style={{paddingBottom: '10px'}} className="col-xs-12">
							<div style={{display: 'inline-block'}}>
								<StarSvgRating totalRating={this.state.totalRating}/>
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
			} else {
				return false;
			}
		}
	}

	class FeedbackList extends React.Component {

		constructor(props) {
			super(props);
			this.state = {feedbacks: [], client: {}, productId: null};
		}

		async componentDidMount() {
			const clientId = feedbackListDom.getAttribute('data-clientid');
			const productId = feedbackListDom.getAttribute('data-producid');
			const client = await axios.get(`http://localhost:3000/api/clients/${clientId}`);
			let feedbacks = [];
			if (client.data.displaywidget) {
				feedbacks = await axios.get(`http://localhost:3000/api/products/${productId}/feedbacks`, {
					params: {
						filter: {where: {and: [{totalratingscore: {neq: null}}, {approved: 1}]}, include: 'customer'}
					}
				});
				this.setState({feedbacks: feedbacks.data});
				this.setState({productId: productId});
			}
			this.setState({client: client.data});
		}

		render() {
			if (this.state.client.displaywidget) {
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
						<FeedbackListHeader productId={this.state.productId}/>
						<div className="col-xs-12 col-md-8 rating-list">
							<div className="feedback-list-container">{feedbacks}</div>
						</div>
					</div>
				);
			} else {
				return false;
			}
		}
	}
	ReactDOM.render(
		<FeedbackList/>,
		feedbackListDom
	);

}




