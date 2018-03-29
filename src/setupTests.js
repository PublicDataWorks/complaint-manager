import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import models from "./server/models/index"

Enzyme.configure({ adapter: new Adapter() });

afterAll(async() => {
    await models.cases.truncate({cascade:true})
    await models.users.truncate({cascade:true})
});