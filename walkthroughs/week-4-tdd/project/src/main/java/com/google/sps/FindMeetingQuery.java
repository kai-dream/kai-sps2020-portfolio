// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.Collection;
import java.util.List;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.lang.Math;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    // Edge case, this is a hard-requirement from test case, we just cannot create 24 hour event.
    if ((int)request.getDuration() >= TimeRange.WHOLE_DAY.duration()) {
        return new ArrayList<TimeRange>();
    }

    // MeetingRequest already store attendess in HashSet, so I shall get it directly.
    HashSet<String> attendees = new HashSet<String>(request.getAttendees());

    ArrayList<TimeRange> relevantTimerangeList = new ArrayList<>();
    relevantTimerangeList.ensureCapacity(events.size());

    // Time complexity: O(1) * Event names
    for(Event e: events) {
        Set<String> eventAttendees = e.getAttendees();
        
        boolean foundRequiredName = false;
        for (String name: eventAttendees) {
            // If found overlap, keep this event
            if (attendees.contains(name)) {
                foundRequiredName = true;
                break;
            }
        }

        if (foundRequiredName) {
            relevantTimerangeList.add(e.getWhen());
        }
    }

    List<TimeRange> result = new ArrayList<TimeRange>();
    if (relevantTimerangeList.size() == 0) {
        // No relevant event, all day is available.    
        result.add(TimeRange.WHOLE_DAY);
        return result;
    }

    relevantTimerangeList.sort(TimeRange.ORDER_BY_START);
    
    int previousEnd = (int)0; // Non-inclusive, as in TimeRange.end definition
    final int MIN_DURATION = (int)request.getDuration();

    // Time complexity: O(N) where N is the number of relavent events

    for (TimeRange range: relevantTimerangeList) {
        // Check if current range overlaps with previosu event
        // Precondition from sorting is that range.start() >= previousStart
        if (range.start() < previousEnd) {
            // Merge range with previous end
            previousEnd = Math.max(previousEnd, range.end());
        } else {
            // Not overlap with previous event, found a gap
            if (range.start() - previousEnd >= MIN_DURATION) {
                result.add(TimeRange.fromStartEnd(previousEnd, range.start(), false));
            }

            previousEnd = range.end();
        }
    }

    // Handle the last - end of day
    // Appearently, tthe test case, sais it should include the 23:60 case.
    if (TimeRange.END_OF_DAY + 1 - previousEnd >= MIN_DURATION) {
        result.add(TimeRange.fromStartEnd(previousEnd, TimeRange.END_OF_DAY + 1, false));
    }

    // Overall Time complexity: O(P) + O(N) where N is the number of events, P is the total number of people in known events.
    return result;
  }

}
