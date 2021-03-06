import {Core} from '../core/index'
import injectObserver from '../core/events'

class Calendar extends Core {

    constructor(options) {
        super()
        this.options = Object.assign({}, {
            firstColumnIsWeekend: true,
			dayCount: 42,
			startDate: this.nowDate
		}, options)
		this.userSeletDate = new Date(this.options.startDate)
		setTimeout(() => {
			this.dispatchEvent('dateChange', this.go(0))
		}, 0);
	}
	
	// __getDayC
 
    go(params) {
		let date = this.userSeletDate
		if (typeof params !== 'number') {
			throw new Error('[BTime Calendar]: function go() need a number parameter')
		}
		if (params !== 0) {
			if ( params < 0 ) {
				if (date.getDate() > 28) {
					date = new Date(date.setDate(1))
				}
				this.userSeletDate = new Date(date.setMonth(date.getMonth() - 1))
				// console.log(this.userSeletDate)
				this.go(params + 1)
			} else {
				if (date.getDate() > 28) {
					date = new Date(date.setDate(1))
				}
				this.userSeletDate = new Date(date.setMonth(date.getMonth() + 1))
				// console.log(this.userSeletDate)
				this.go(params - 1)
			}
		}
		return this.__getFinalData(this.userSeletDate)
	}

	setCurrentDate(date) {
		let currentDate = new Date(date)
		// console.log(currentDate)
		if(!currentDate) {
			throw new Error('[BTime Calendar]: function setCurrentDate receive a wrong date' + date)
		}
		this.userSeletDate = currentDate
		this.dispatchEvent('dateChange', this.go(0))
	}
    
    goLastMonth() {
		this.dispatchEvent('dateChange', this.go(-1))
	}

	goNextMonth() {
		this.dispatchEvent('dateChange', this.go(1))
	}

	goLastYear() {
		this.dispatchEvent('dateChange', this.go(-12))
	}

	goNextYear() {
		this.dispatchEvent('dateChange', this.go(12))
	}

	__getFinalData(params) {
		let lastMonthDate = this.__getLastMonthDayCount(params),
			thisMonthDate = this.__getThisMonthDayCount(params),
			fistWeekInMonth = this.__getMondayInMonth(params),
			dayCount = this.options.dayCount,
			year = this.__getThisYear(params),
			month = this.__getThisMonth(params),
			day = this.__getThisDay(params),
			date = {
				lastMonth: [],
				thisMonth: [],
				nextMonth: [],
				currentYear: year,
				currentMonth: month,
				currentDay: day,
				today: `${this.nowDate.getFullYear()}/${this.nowDate.getMonth() + 1}/${this.nowDate.getDate()}`
			}

		if (!this.options.firstColumnIsWeekend) {
			fistWeekInMonth--
		}

		for (let i = fistWeekInMonth; i > 0; i--) {
			date.lastMonth.push(lastMonthDate - i + 1)
		}

		for (let i = 1; i <= thisMonthDate; i++) {
			date.thisMonth.push(i)
		}

		for (let i = 1; i <= dayCount - thisMonthDate - fistWeekInMonth; i++) {
			date.nextMonth.push(i)
		}

		return date
	}

}

injectObserver(Calendar)

export {Calendar}