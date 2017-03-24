/*
 * Doughnut Podcast Client
 * Copyright (C) 2017 Chris Dyer
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import DataType from 'sequelize'
import Model from '../sequelize'

const Category = Model.define('Category', {
  id: {
    type: DataType.INTEGER,
    field: 'id',
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: DataType.STRING, unique: true }
}, {
  tableName: 'categories',
  timestamps: false,
  freezeTableName: true
})

export default Category
