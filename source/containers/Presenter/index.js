import { connect } from 'react-redux';
import { find } from 'lodash';
import keycode from 'keycode';
import { ADD_SLIDE, EDIT_SLIDE, DELETE_SLIDE} from '../../store/constants/action_types';
import { SET_FULLSCEEN, SET_MODE } from '../../store/constants/modes';


import createControls from '../../components/controls';
import createSlide from '../../components/slide';
import createFullscreen from '../../components/fullscreen';
import createDeck from '../../containers/Deck';

const selectProps = (state, ownProps) => {
  return {
    slides: state.slides,
    slide: find(state.slides, (slide) => slide.id === Number(ownProps.params.slideId)),
    totalSlides: state.slides.length,
    fullscreen: state.modes.fullscreen,
    currentMode: state.modes.mode
  };
};

const handleKeyup = (ev) => {
  const nextKeys = ['up', 'right', 'w', 'd', 'l', 'k'];
  const prevKeys = ['down', 'left', 's', 'a', 'h', 'j'];
  const navigateNext = () => { console.log('next'); };
  const navigatePrev = () => { console.log('prev'); };

  if (nextKeys.indexOf(keycode(ev)) > -1) {
    navigateNext();
    return;
  }
  if (prevKeys.indexOf(keycode(ev)) > -1) {
    navigatePrev();
    return;
  }
};

const componentDidMount = () => {
  window.addEventListener('keyup', handleKeyup);
};


export default (React) => connect(selectProps)((props) => {
  const Controls = createControls(React);
  const Slide = createSlide(React);
  const Deck = createDeck(React);
  const Fullscreen = createFullscreen(React);
  const {
    slides,
    slide,
    dispatch,
    fullscreen,
    currentMode
  } = props;

  const toggleFullscreen = () => dispatch({ type: SET_FULLSCEEN, fullscreen: !fullscreen});
  //Control actions
  const toggleMode = () => dispatch({type: SET_MODE, mode: currentMode === 'show' ? 'edit' : 'show' });
  const addSlide = (payload) => dispatch({type: ADD_SLIDE, title: 'Change me', text: 'Your awesome __markdown__ content'});
  const deleteSlide = () => dispatch({type: DELETE_SLIDE, id: slide.id});
  // Slide actions
  const editSlide = (payload) => dispatch({type: EDIT_SLIDE, ...payload});

  const controlProps = {
    ...props,
    isVisible: props.controlsVisible,
    currentIdx: Number(props.params.slideId),
    pushPath: props.pushPath,
    toggleText: currentMode === 'show' ? 'edit' : 'preview',
    actions: {
      addSlide,
      toggleMode,
      deleteSlide
    }
  };

  const slideProps = {
    ...slide,
    mode: currentMode,
    key: slide.id,
    isEditing: props.currentMode,
    actions: {
      editSlide,
    }
  };

  const fullscreenProps = {
    isFullscreen: fullscreen,
    onExitFullscreen: toggleFullscreen,
  };

  componentDidMount();
  return (
    <article>
      <Fullscreen {...fullscreenProps} >
        <Slide {...slideProps} />
      </Fullscreen>
      <Deck />
      <Controls { ...controlProps } />
    </article>
  );
});
