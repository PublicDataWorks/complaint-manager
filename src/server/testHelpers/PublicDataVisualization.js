import { QUERY_TYPES } from "../../sharedUtilities/constants";

class PublicDataVisualization {
  constructor(build) {
    if (build.id) {
      this.id = build.id;
    }
    this.title = build.title;
    this.subtitle = build.subtitle;
    this.queryType = build.queryType;
    this.collapsedText = build.collapsedText;
    this.fullMessage = build.fullMessage;
    this.orderKey = build.orderKey;
  }

  static get Builder() {
    class Builder {
      defaultPublicDataVisualization() {
        this.title = "Generic Visualization";
        this.subtitle = "In which we visualize something";
        this.queryType = Object.keys(QUERY_TYPES)[0];
        this.collapsedText = "collapsed text";
        this.fullMessage =
          "collapsed text was only the beginning of the full message";
        this.orderKey = 1;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withTitle(title) {
        this.title = title;
        return this;
      }

      withSubtitle(subtitle) {
        this.subtitle = subtitle;
        return this;
      }

      withQueryType(queryType) {
        this.queryType = queryType;
        return this;
      }

      withCollapsedText(collapsedText) {
        this.collapsedText = collapsedText;
        return this;
      }

      withFullMessage(fullMessage) {
        this.fullMessage = fullMessage;
        return this;
      }

      withOrderKey(orderKey) {
        this.orderKey = orderKey;
        return this;
      }

      build() {
        return new PublicDataVisualization(this);
      }
    }
    return Builder;
  }
}

export default PublicDataVisualization;
