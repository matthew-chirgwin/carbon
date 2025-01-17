/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import {
  CheckmarkFilled16 as CheckmarkFilled,
  ChevronDown16,
} from '@carbon/icons-react';
import { keys, matches } from '../../internal/keyboard';
import uid from '../../tools/uniqueId';

const { prefix } = settings;

export class Tile extends Component {
  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,
  };

  render() {
    const { children, className, ...other } = this.props;
    const tileClasses = classNames(`${prefix}--tile`, className);
    return (
      <div className={tileClasses} {...other}>
        {children}
      </div>
    );
  }
}

export class ClickableTile extends Component {
  state = {};

  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * The href for the link.
     */
    href: PropTypes.string,

    /**
     * The rel property for the link.
     */
    rel: PropTypes.string,
  };

  static defaultProps = {
    clicked: false,
    handleClick: () => {},
    handleKeyDown: () => {},
  };

  handleClick = evt => {
    evt.persist();
    this.setState(
      {
        clicked: !this.state.clicked,
      },
      () => {
        this.props.handleClick(evt);
      }
    );
  };

  handleKeyDown = evt => {
    evt.persist();
    if (matches(evt, [keys.Enter, keys.Space])) {
      this.setState(
        {
          clicked: !this.state.clicked,
        },
        () => {
          this.props.handleKeyDown(evt);
        }
      );
    } else {
      this.props.handleKeyDown(evt);
    }
  };

  static getDerivedStateFromProps({ clicked }, state) {
    const { prevClicked } = state;
    return prevClicked === clicked
      ? null
      : {
          clicked,
          prevClicked: clicked,
        };
  }

  render() {
    const {
      children,
      href,
      className,
      handleClick, // eslint-disable-line
      handleKeyDown, // eslint-disable-line
      clicked, // eslint-disable-line
      ...other
    } = this.props;

    const classes = classNames(
      `${prefix}--link`,
      `${prefix}--tile`,
      `${prefix}--tile--clickable`,
      {
        [`${prefix}--tile--is-clicked`]: this.state.clicked,
      },
      className
    );

    return (
      <a
        href={href}
        className={classes}
        {...other}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}>
        {children}
      </a>
    );
  }
}

export class SelectableTile extends Component {
  state = {
    selected: this.props.selected,
  };

  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * `true` to select this tile.
     */
    selected: PropTypes.bool,

    /**
     * The ID of the `<input>`.
     */
    id: PropTypes.string,

    /**
     * The value of the `<input>`.
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

    /**
     * The `name` of the `<input>`.
     */
    name: PropTypes.string,

    /**
     * The `title` of the `<input>`.
     */
    title: PropTypes.string,

    /**
     * The empty handler of the `<input>`.
     */
    onChange: PropTypes.func,

    /**
     * The description of the checkmark icon.
     */
    iconDescription: PropTypes.string,

    /**
     * Specify the tab index of the wrapper element
     */
    tabIndex: PropTypes.number,
  };

  static defaultProps = {
    value: 'value',
    title: 'title',
    iconDescription: 'Tile checkmark',
    selected: false,
    handleClick: () => {},
    handleKeyDown: () => {},
    onChange: () => {},
    tabIndex: 0,
  };

  handleClick = evt => {
    evt.preventDefault();
    evt.persist();
    const isInput = evt.target === this.input;
    if (!isInput) {
      this.setState(
        {
          selected: !this.state.selected,
        },
        () => {
          this.props.handleClick(evt);
        }
      );
    } else {
      this.props.handleClick(evt);
    }
  };

  handleKeyDown = evt => {
    evt.persist();
    if (matches(evt, [keys.Enter, keys.Space])) {
      evt.preventDefault();
      this.setState(
        {
          selected: !this.state.selected,
        },
        () => {
          this.props.handleKeyDown(evt);
        }
      );
    } else {
      this.props.handleKeyDown(evt);
    }
  };

  static getDerivedStateFromProps({ selected }, state) {
    const { prevSelected } = state;
    return prevSelected === selected
      ? null
      : {
          selected,
          prevSelected: selected,
        };
  }

  render() {
    const {
      children,
      id,
      tabIndex,
      value,
      name,
      title,
      iconDescription,
      className,
      handleClick, // eslint-disable-line
      handleKeyDown, // eslint-disable-line
      onChange,
      ...other
    } = this.props;

    const classes = classNames(
      `${prefix}--tile`,
      `${prefix}--tile--selectable`,
      {
        [`${prefix}--tile--is-selected`]: this.state.selected,
      },
      className
    );

    return (
      <>
        <input
          ref={input => {
            this.input = input;
          }}
          tabIndex={-1}
          id={id}
          className={`${prefix}--tile-input`}
          value={value}
          onChange={onChange}
          type="checkbox"
          name={name}
          title={title}
          checked={this.state.selected}
        />
        <label
          htmlFor={id}
          className={classes}
          tabIndex={tabIndex}
          {...other}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}>
          <div className={`${prefix}--tile__checkmark`}>
            <CheckmarkFilled aria-label={iconDescription}>
              {iconDescription && <title>{iconDescription}</title>}
            </CheckmarkFilled>
          </div>
          <div className={`${prefix}--tile-content`}>{children}</div>
        </label>
      </>
    );
  }
}

export class ExpandableTile extends Component {
  state = {};

  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * `true` if the tile is expanded.
     */
    expanded: PropTypes.bool,

    /**
     * The `tabindex` attribute.
     */
    tabIndex: PropTypes.number,

    /**
     * The description of the "collapsed" icon that can be read by screen readers.
     */
    tileCollapsedIconText: PropTypes.string,

    /**
     * The description of the "expanded" icon that can be read by screen readers.
     */
    tileExpandedIconText: PropTypes.string,

    /**
     * An ID that can be provided to aria-labelledby
     */
    id: PropTypes.string,
  };

  static defaultProps = {
    tabIndex: 0,
    expanded: false,
    tileMaxHeight: '0',
    handleClick: () => {},
    tileCollapsedIconText: 'Expand',
    tileExpandedIconText: 'Collapse',
  };

  static getDerivedStateFromProps(
    { expanded, tileMaxHeight, tilePadding },
    state
  ) {
    const {
      prevExpanded,
      prevTileMaxHeight,
      prevTilePadding,
      expanded: currentExpanded,
      tileMaxHeight: currentTileMaxHeight,
      tilePadding: currentTilePadding,
    } = state;
    const expandedChanged = prevExpanded !== expanded;
    const tileMaxHeightChanged = prevTileMaxHeight !== tileMaxHeight;
    const tilePaddingChanged = prevTilePadding !== tilePadding;
    return !expandedChanged && !tileMaxHeightChanged && !tilePaddingChanged
      ? null
      : {
          expanded: !expandedChanged ? currentExpanded : expanded,
          tileMaxHeight: !tileMaxHeightChanged
            ? currentTileMaxHeight
            : tileMaxHeight,
          tilePadding: !tilePaddingChanged ? currentTilePadding : tilePadding,
          prevExpanded: expanded,
          prevTileMaxHeight: tileMaxHeight,
          prevTilePadding: tilePadding,
        };
  }

  componentDidMount = () => {
    if (this.refs[0]) {
      this.aboveTheFold = ReactDOM.findDOMNode(this.refs[0]); // eslint-disable-line
    }
    const getStyle = window.getComputedStyle(this.tile, null);
    this.setState({
      tileMaxHeight: this.aboveTheFold.getBoundingClientRect().height,
      tilePadding:
        parseInt(getStyle.getPropertyValue('padding-top'), 10) +
        parseInt(getStyle.getPropertyValue('padding-bottom'), 10),
    });
  };

  componentDidUpdate = prevProps => {
    if (prevProps.expanded !== this.props.expanded) this.setMaxHeight();
  };

  setMaxHeight = () =>
    this.setState({
      tileMaxHeight: this.state.expanded
        ? this.tileContent.getBoundingClientRect().height
        : this.aboveTheFold.getBoundingClientRect().height,
    });

  handleClick = evt => {
    evt.persist();
    this.setState(
      {
        expanded: !this.state.expanded,
      },
      () => {
        this.setMaxHeight();
        this.props.handleClick(evt);
      }
    );
  };

  handleKeyDown = evt => {
    if (matches(evt, [keys.Enter, keys.Space])) {
      evt.persist();
      this.setState(
        {
          expanded: !this.state.expanded,
        },
        () => {
          this.setMaxHeight();
          this.props.handleClick(evt);
        }
      );
    }
  };

  getChildren = () => {
    return React.Children.map(this.props.children, child => child);
  };

  // a unique ID generated for use in aria-labelledby if one isn't providedj
  uid = uid();

  render() {
    const {
      tabIndex,
      className,
      tileMaxHeight, // eslint-disable-line
      tilePadding, // eslint-disable-line
      handleClick, // eslint-disable-line
      tileCollapsedIconText, // eslint-disable-line
      tileExpandedIconText, // eslint-disable-line
      ...other
    } = this.props;

    const { expanded } = this.state;

    const classes = classNames(
      `${prefix}--tile`,
      `${prefix}--tile--expandable`,
      {
        [`${prefix}--tile--is-expanded`]: expanded,
      },
      className
    );

    const tileStyle = {
      maxHeight: expanded
        ? null
        : this.state.tileMaxHeight + this.state.tilePadding,
    };
    const content = this.getChildren().map((child, index) => {
      return React.cloneElement(child, { ref: index });
    });
    const buttonId = this.props.id ? `${this.props.id}__button` : this.uid;
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
      <div
        ref={tile => {
          this.tile = tile;
        }}
        style={tileStyle}
        className={classes}
        {...other}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyDown}
        tabIndex={tabIndex}>
        <button
          className={`${prefix}--tile__chevron`}
          aria-labelledby={buttonId}
          aria-expanded={expanded}>
          <ChevronDown16
            id={buttonId}
            aria-label={expanded ? tileExpandedIconText : tileCollapsedIconText}
            alt={expanded ? tileExpandedIconText : tileCollapsedIconText}
            description={
              expanded ? tileExpandedIconText : tileCollapsedIconText
            }
          />
        </button>
        <div
          ref={tileContent => {
            this.tileContent = tileContent;
          }}
          className={`${prefix}--tile-content`}>
          {content}
        </div>
      </div>
    );
  }
}

export class TileAboveTheFoldContent extends Component {
  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <span className={`${prefix}--tile-content__above-the-fold`}>
        {children}
      </span>
    );
  }
}

export class TileBelowTheFoldContent extends Component {
  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,
  };

  render() {
    const { children } = this.props;

    return (
      <span className={`${prefix}--tile-content__below-the-fold`}>
        {children}
      </span>
    );
  }
}
