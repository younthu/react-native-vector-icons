import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './App.css';

import AntDesign from '../../glyphmaps/AntDesign.json';
import Entypo from '../../glyphmaps/Entypo.json';
import EvilIcons from '../../glyphmaps/EvilIcons.json';
import Feather from '../../glyphmaps/Feather.json';
import FontAwesome from '../../glyphmaps/FontAwesome.json';
import FontAwesome5 from '../../glyphmaps/FontAwesome5Free.json';
import FontAwesome5Brands from '../../glyphmaps/FontAwesome5Free.json';
import FontAwesome5Meta from '../../glyphmaps/FontAwesome5Free_meta.json';
import Foundation from '../../glyphmaps/Foundation.json';
import Ionicons from '../../glyphmaps/Ionicons.json';
import MaterialCommunityIcons from '../../glyphmaps/MaterialCommunityIcons.json';
import MaterialIcons from '../../glyphmaps/MaterialIcons.json';
import Octicons from '../../glyphmaps/Octicons.json';
import SimpleLineIcons from '../../glyphmaps/SimpleLineIcons.json';
import Zocial from '../../glyphmaps/Zocial.json';
import { TitleBar, Toolbar, SearchField } from 'react-desktop/macOs';
// render html fragment to png
import html2canvas from 'html2canvas'
// Get ReactDOM
import ReactDOM from "react-dom"

const IconFamilies = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome5Brands,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
  Octicons,
  Zocial,
};

const WAITING_INTERVAL = 300;

class Icon extends PureComponent {
  static propTypes = {
    family: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };

  render() {
    return (
      <span style={{ fontFamily: this.props.family }} {...this.props}>
        {String.fromCharCode(IconFamilies[this.props.family][this.props.name])}
      </span>
    );
  }
}

const HeaderBar = props => {
  return (
    <div className="Header-Container">
      <div className="Header-Content">
        <h1 className="Header-Title">react-native-vector-icons directory</h1>
      </div>
    </div>
  );
};

class SearchBar extends PureComponent {
  timer = null;

  state = {
    keyword: '',
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.inputRef.value);
  };

  handleChange = e => {
    e.preventDefault();
    clearInterval(this.timer);

    this.setState({ keyword: this.inputRef.value });

    this.timer = setTimeout(
      () => this.props.onSubmit(this.state.keyword),
      WAITING_INTERVAL
    );
  };

  render() {
    return (
      <div className="Search-Container">
        <div className="Search-Content">
          <form onSubmit={this.handleSubmit}>
            <Icon family="FontAwesome" name="search" className="Search-Icon" />
            <input
              ref={ref => (this.inputRef = ref)}
              onChange={this.handleChange}
              placeholder="Search for an icon"
              type="text"
              className="Search-Input"
            />
          </form>
        </div>
      </div>
    );
  }
}



class Box extends PureComponent {
  constructor() {
    super()
    this.state = {color:'white',index:0, dataURL:''}
  }

  render(){
    return this.renderIcon(this.props.family, this.props.name);
  }
  renderIcon(family, name) {
    let familyName = family;

    if (family === 'FontAwesome5') {
      if (FontAwesome5Meta['solid'].indexOf(name) === -1)
        familyName = 'FontAwesome5Brands';
    }

    return (
      <div className="Result-Icon-Container" key={name} style={{'background-color':this.state.color}} onClick={()=>{
        this.setState({color: ['white','black','red','blue'][(this.state.index + 1)%4], index: this.state.index+1})
      }}>
        <Icon family={familyName} name={name} className="Result-Icon" />
        <h4 className="Result-Icon-Name">{name}</h4>

        <div style={{display: 'block'}}>
          <button onClick={()=>{
            {/*alert('hi')*/}
            let that = this
            html2canvas(ReactDOM.findDOMNode(this)).then(function(canvas) {
              document.body.appendChild(canvas);
              that.setState({dataURL: canvas.toDataURL()})
              console.log(canvas.toDataURL())
            });
          }}>导出</button>
          <a href={this.state.dataURL} download="testicon.png" target="_blank" >下载</a>
        </div>
      </div>
    );
  }
}

class App extends PureComponent {
  constructor() {
    super();
    this.state = {
      matches: [],
    };
  }

  componentDidMount() {
    this.handleSubmit('');
  }

  handleSubmit = text => {
    let matches = [];
    Object.keys(IconFamilies).forEach(family => {
      const icons = IconFamilies[family];
      const names = Object.keys(icons);
      const results = names.filter(name => name.indexOf(text) >= 0);
      if (results.length) {
        matches = [...matches, { family, names: results }];
      }
    });

    this.setState({ matches });
  };

  renderFamily(familyName) {
    return (
      <div>
        {Object.keys(IconFamilies[familyName]).map(iconName => (
          <Icon
            key={iconName + familyName}
            family={familyName}
            name={iconName}
          />
        ))}
      </div>
    );
  }

  renderMatch = match => {
    const { family, names } = match;
    return (
      <div className="Result-Row" key={family}>
        <h2 className="Result-Title">{family}</h2>

        <div className="Result-List">
          {names.map(name => this.renderIcon(family, name))}
        </div>
      </div>
    );
  };

  renderIcon(family, name) {
    let familyName = family;

    if (family === 'FontAwesome5') {
      if (FontAwesome5Meta['solid'].indexOf(name) === -1)
        familyName = 'FontAwesome5Brands';
    }

    return (
      <Box family={familyName} name={name} />
    );
  }

  renderNotFound() {
    return (
      <div className="Result-Row">
        <h2 className="Result-Title">Icon not found.</h2>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <TitleBar inset>
          <Toolbar height="43" horizontalAlignment="right">
            <SearchField
              placeholder="Search"
              defaultValue=""
              onEnter={this.handleSubmit}
            />
          </Toolbar>
        </TitleBar>
        <HeaderBar />
        <SearchBar onSubmit={this.handleSubmit} />
        <div className="Container">
          {this.state.matches.map(this.renderMatch)}
          {this.state.matches.length === 0 && this.renderNotFound()}
        </div>
      </div>
    );
  }
}

export default App;
