import Sequelize from '../sequelize'
import Podcast from './podcast'

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { Podcast }