import * as React from "react";
import {ActivityIndicator} from "react-native";
import ActionButton from "react-native-action-button";
import {Icon} from "react-native-elements";
import {connect} from "react-redux";
import {Stream} from "../../models/Stream";
import {RootReducerState} from "../../reducers/root-reducer";
import {setNextStream, setPreviousStream, setStreamPausedState} from "../../reducers/streams";
import {COLOR_DANGER, COLOR_PRIMARY} from "../../styles";
import {injectedFunctionInvoker} from "../../utilities";

interface Props {
    // injected
    activeStream?: Stream | null;
    loading?: boolean;
    paused?: boolean;
    onNextPressed?: () => void;
    onPreviousPressed?: () => void;
    setStreamPausedState?: (paused: boolean) => void;
}

class FloatingMediaControlsButtonContainer extends React.Component<Props> {

    public render() {
        if (!this.props.activeStream) {
            return null;
        }
        return (
            <ActionButton buttonColor="rgba(231,76,60,1)" autoInactive={false}>
                <ActionButton.Item buttonColor="#3498db" onPress={this.onPreviousPressed}>
                    <Icon name="skip-previous" size={22} color={COLOR_PRIMARY}/>
                </ActionButton.Item>
                <ActionButton.Item buttonColor="#3498db" onPress={this.onNextPressed}>
                    <Icon name="skip-next" size={22} color={COLOR_PRIMARY}/>
                </ActionButton.Item>
                <ActionButton.Item
                    buttonColor={this.props.paused ? "#1abc9c" : COLOR_DANGER}
                    onPress={this.onPlayPausePressed}
                    title={this.props.activeStream ? `Listening to ${this.props.activeStream.mediumName}` : ""}
                >
                    {!this.props.loading &&
                    <Icon name={this.props.paused ? "chevron-right" : "pause"} size={22} color={COLOR_PRIMARY}/>}
                    {this.props.loading &&
                    <ActivityIndicator size="large" style={{width: 80, height: 80}} color={COLOR_PRIMARY}/>}
                </ActionButton.Item>
            </ActionButton>
        );
    }

    private onPlayPausePressed = () => {
        injectedFunctionInvoker(this.props.setStreamPausedState, !this.props.paused)
    };
    private onNextPressed = () => injectedFunctionInvoker(this.props.onNextPressed);
    private onPreviousPressed = () => injectedFunctionInvoker(this.props.onPreviousPressed);
}

export const FloatingMediaControlsButton = connect(
    (state: RootReducerState) => ({
        activeStream: state.streams.activeStream,
        paused: state.streams.paused,
        loading: state.streams.loading,
    }),
    ((dispatch) => ({
        setStreamPausedState: (paused: boolean) => dispatch(setStreamPausedState(paused)),
        onNextPressed: () => dispatch(setNextStream()),
        onPreviousPressed: () => dispatch(setPreviousStream()),
    })),
)(FloatingMediaControlsButtonContainer);