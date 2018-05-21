import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
	public node: any;
	public constructor(props: IFiddleListingProps) {
		super(props);
		this.onMouseWheel = this.onMouseWheel.bind(this);
	}
	public componentDidMount() {
		this.node = ReactDOM.findDOMNode(this);
	}
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

		return (<div onWheel={this.onMouseWheel} className='fiddle-listing'>{fiddles}</div>)
	}

	private onMouseWheel(e: any) {
		const x: number = e.deltaX;
		const y: number = e.deltaY;
		if (Math.abs(x) > Math.abs(y)) { return; }
		e.preventDefault();
		e.stopPropagation();
		this.node.scrollLeft += y;
	}
}