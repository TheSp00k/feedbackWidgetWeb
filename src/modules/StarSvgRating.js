import React from 'react';

class StarSvgRating extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div itemProp="ratingValue" style={{ backgroundColor: this.props.client.themecolor }} className="feedback-circle">{this.props.totalRating}</div>
		)
	}
}
export default StarSvgRating;