import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import EventEmitter from "events";

EventEmitter.defaultMaxListeners = 67;
Enzyme.configure({ adapter: new Adapter() });
