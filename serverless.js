const { Component } = require('@serverless/core')
const random = require('ext/string/random')

// Create a new component by extending the Component Class
class TencentSCFMultiRegion extends Component {
  mergeJson(sourceJson, targetJson) {
    for (const eveKey in sourceJson) {
      if (targetJson.hasOwnProperty(eveKey)) {
        if (eveKey == 'events') {
          for (let i = 0; i < sourceJson[eveKey].length; i++) {
            const sourceEvents = JSON.stringify(sourceJson[eveKey][i])
            const targetEvents = JSON.stringify(targetJson[eveKey])
            if (targetEvents.indexOf(sourceEvents) == -1) {
              targetJson[eveKey].push(sourceJson[eveKey][i])
            }
          }
        } else {
          if (typeof sourceJson[eveKey] != 'string') {
            this.mergeJson(sourceJson[eveKey], targetJson[eveKey])
          } else {
            targetJson[eveKey] = sourceJson[eveKey]
          }
        }
      } else {
        targetJson[eveKey] = sourceJson[eveKey]
      }
    }
    return targetJson
  }

  async default(inputs = {}) {
    const regionList = typeof inputs.region == 'string' ? [inputs.region] : inputs.region
    const baseInputs = {}
    const functions = {
      functionList: []
    }
    for (const eveKey in inputs) {
      if (eveKey != 'region' && eveKey.indexOf('ap-') != 0) {
        baseInputs[eveKey] = inputs[eveKey]
      }
    }

    for (let i = 0; i < regionList.length; i++) {
      this.context.status(`Deploying ${regionList[i]} funtion`)
      let tempInputs = JSON.parse(JSON.stringify(baseInputs)) // clone
      tempInputs.region = regionList[i]
      tempInputs.fromClientRemark = tempInputs.fromClientRemark || 'tencent-scf-multi-region'
      if (inputs[regionList[i]]) {
        tempInputs = this.mergeJson(inputs[regionList[i]], tempInputs)
      }
      const tempKey = `${tempInputs.region}-${random({ length: 6 })}`
      functions.functionList.push(tempKey)
      const tencentCloudFunction = await this.load('@serverless/tencent-scf', tempKey)
      functions[tempInputs.region] = await tencentCloudFunction(tempInputs)
      this.context.status(`Deployed ${regionList[i]} funtion`)
    }

    this.state = functions
    await this.save()

    return functions
  }

  async remove(inputs = {}) {
    const removeInput = {
      fromClientRemark: inputs.fromClientRemark || 'tencent-scf-multi-region'
    }
    for (let i = 0; i < this.state.functionList.length; i++) {
      console.log(this.state.functionList[i])
      this.context.status(`Removing ${this.state.functionList[i]} funtion`)
      const tencentCloudFunction = await this.load(
        '@serverless/tencent-scf',
        this.state.functionList[i]
      )
      await tencentCloudFunction.remove(removeInput)
      this.context.status(`Removed ${this.state.functionList[i]} funtion`)
    }

    // after removal we clear the state to keep it in sync with the service API
    // this way if the user tried to deploy again, there would be nothing to remove
    this.state = {}
    await this.save()

    // might be helpful to output the Bucket that was removed
    return {}
  }
}

// don't forget to export the new Componnet you created!
module.exports = TencentSCFMultiRegion
