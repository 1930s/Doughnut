import Sequelize from '../sequelize'
import { Podcast, Episode } from './podcast'

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { Podcast, Episode }