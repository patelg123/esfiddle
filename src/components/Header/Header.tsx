import * as React from 'react';
import { NavLink } from 'react-router-dom';

import './Header.css';

import SearchBox from './SearchBox/SearchBox';

interface IHeaderProps {
	theme: string
}

export default class Header extends React.Component<IHeaderProps> {
	public constructor(props: IHeaderProps) {
		super(props);
	}
	public render() {
		return (
			<div className={'header header-' + this.props.theme}>
				<div className={'header__box'}>
					<SearchBox />
				</div>
				<div className={'header__box'}>
					<NavLink to="/">
						<div className={'header__logo'} />
					</NavLink>
				</div>
				<div className={'header__box header__navigation'}>
					<NavLink activeClassName="active" to="/editor">Editor</NavLink>
					<NavLink activeClassName="active" to="/about">About</NavLink>
					<NavLink activeClassName="active" to="/blog">Blog</NavLink>
					<div className={'header__user'}>
						Login
					</div>
				</div>
			</div>
		);
	}
}