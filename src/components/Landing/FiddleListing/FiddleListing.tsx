import * as React from 'react';
import { Link } from 'react-router-dom';

import './FiddleListing.css';

interface IFiddle {
	author?: string,
	description: string,
	image: string,
	link: string,
	title: string
}

interface IFiddleListingProps {
	data: IFiddle[],
	loading: boolean
}

export default class FiddleListing extends React.Component<IFiddleListingProps> {
	public render() {
		const fiddles = this.props.data.map((data, i) => (
			<Link key={i} to={data.link} className='fiddle-listing__fiddle'>
				<div className='fiddle-listing__fiddle__image' style={{backgroundImage: `url(${data.image})`}} />
				<div className='fiddle-listing__fiddle__content'>
					<div className='fiddle-listing__fiddle__title'>{data.title}</div>
					{data.author &&
					<div className='fiddle-listing__fiddle__author'>{data.author}</div>}
					<div className='fiddle-listing__fiddle__description'>{data.description}</div>
				</div>
			</Link>
		));

		return (<div className='fiddle-listing'>{fiddles}</div>)
	}
}