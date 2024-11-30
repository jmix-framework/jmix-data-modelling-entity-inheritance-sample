package io.jmix.petclinic.view.visit;

import com.vaadin.flow.component.AbstractField;
import com.vaadin.flow.component.html.H4;
import com.vaadin.flow.component.tabs.Tab;
import com.vaadin.flow.router.Route;
import io.jmix.core.MessageTools;
import io.jmix.core.Metadata;
import io.jmix.core.metamodel.datatype.DatatypeFormatter;
import io.jmix.core.security.CurrentAuthentication;
import io.jmix.flowui.DialogWindows;
import io.jmix.flowui.Dialogs;
import io.jmix.flowui.UiComponents;
import io.jmix.flowui.ViewNavigators;
import io.jmix.flowui.app.inputdialog.DialogActions;
import io.jmix.flowui.app.inputdialog.DialogOutcome;
import io.jmix.flowui.app.inputdialog.InputParameter;
import io.jmix.flowui.component.checkboxgroup.JmixCheckboxGroup;
import io.jmix.flowui.component.select.JmixSelect;
import io.jmix.flowui.component.tabsheet.JmixTabSheet;
import io.jmix.flowui.kit.action.ActionPerformedEvent;
import io.jmix.flowui.kit.component.ComponentUtils;
import io.jmix.flowui.model.CollectionLoader;
import io.jmix.flowui.model.DataContext;
import io.jmix.flowui.view.*;
import io.jmix.fullcalendarflowui.component.FullCalendar;
import io.jmix.fullcalendarflowui.component.data.EntityCalendarEvent;
import io.jmix.fullcalendarflowui.component.event.*;
import io.jmix.petclinic.entity.visit.*;
import io.jmix.petclinic.view.main.MainView;
import io.jmix.petclinic.view.visit.calendar.MonthFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

// tag::start-class[]
@Route(value = "visits", layout = MainView.class)
@ViewController("petclinic_Visit.list")
@ViewDescriptor("visit-list-view.xml")
@DialogMode(width = "64em")
public class VisitListView extends StandardListView<Visit> {

    // end::start-class[]
    private static final Logger log = LoggerFactory.getLogger(VisitListView.class);

    @Autowired
    private CurrentAuthentication currentAuthentication;
    @Autowired
    private DialogWindows dialogWindows;
    @Autowired
    private DatatypeFormatter datatypeFormatter;
    @ViewComponent
    private JmixCheckboxGroup<VisitType> visitTypeField;
    @ViewComponent
    private CollectionLoader<Visit> visitsCalendarDl;
    @ViewComponent
    private H4 calendarTitle;
    @ViewComponent
    private FullCalendar calendar;
    @ViewComponent
    private JmixSelect<CalendarViewMode> calendarViewMode;
    @ViewComponent("contentTabSheet.allVisitsTab")
    private Tab contentTabSheetAllVisitsTab;
    @ViewComponent
    private CollectionLoader<Visit> visitsDl;
    @ViewComponent
    private DataContext dataContext;
    @Autowired
    private Dialogs dialogs;
    @Autowired
    private MessageBundle messageBundle;
    @Autowired
    private UiComponents uiComponents;
    @Autowired
    private MessageTools messageTools;
    @Autowired
    private Metadata metadata;
    @Autowired
    private ViewNavigators viewNavigators;

    @Subscribe
    public void onInit(final InitEvent event) {
        initTypeFilter();
    }

    @Subscribe
    public void onReady(final ReadyEvent event) {
        setCalendarViewMode(CalendarViewMode.MONTH);
    }

    private void setCalendarViewMode(CalendarViewMode viewMode) {
        calendarViewMode.setValue(viewMode);
    }

    private void initTypeFilter() {
        visitTypeField.setItems(VisitType.class);
        visitTypeField.setValue(EnumSet.allOf(VisitType.class));
    }

    @Subscribe("calendar")
    public void onCalendarEventClick(final EventClickEvent event) {
        EntityCalendarEvent<Visit> entityCalendarEvent = event.getCalendarEvent();
        dialogWindows.detail(this, Visit.class)
                .editEntity(entityCalendarEvent.getEntity())
                .open();
    }

    @Subscribe("calendarHome")
    public void onCalendarHome(final ActionPerformedEvent event) {
        calendar.navigateToToday();
    }

    @Subscribe("calendarPrev")
    public void onCalendarPrev(final ActionPerformedEvent event) {
        calendar.navigateToPrevious();
    }

    @Subscribe("calendarNext")
    public void onCalendarNext(final ActionPerformedEvent event) {
        calendar.navigateToNext();
    }

    @Subscribe("calendarViewMode")
    public void onCalendarViewModeComponentValueChange(final AbstractField.ComponentValueChangeEvent<JmixSelect<CalendarViewMode>, CalendarViewMode> event) {
        if (event.isFromClient()) {
            calendar.setCalendarDisplayMode(event.getValue().getCalendarDisplayMode());
        }
    }

    @Subscribe("calendar")
    public void onCalendarDayNavigationLinkClick(final DayNavigationLinkClickEvent event) {
        CalendarViewMode.fromCalendarDisplayMode(calendar.getCurrentCalendarDisplayMode())
                .ifPresent(it -> {
                    if (it.equals(CalendarViewMode.MONTH) || it.equals(CalendarViewMode.WEEK)) {
                        calendar.navigateToDate(event.getDate());
                        calendar.setCalendarDisplayMode(CalendarViewMode.DAY.getCalendarDisplayMode());
                    }
                });
    }

    @Subscribe("calendar")
    public void onCalendarWeekNavigationLinkClick(final WeekNavigationLinkClickEvent event) {
        CalendarViewMode.fromCalendarDisplayMode(calendar.getCurrentCalendarDisplayMode())
                .ifPresent(it -> {
                    if (it.equals(CalendarViewMode.MONTH) || it.equals(CalendarViewMode.DAY)) {
                        calendar.navigateToDate(event.getDate());
                        calendar.setCalendarDisplayMode(CalendarViewMode.WEEK.getCalendarDisplayMode());
                    }
                });
    }

    @Subscribe("calendar")
    public void onCalendarSelect(final SelectEvent event) {
        CalendarViewMode.fromCalendarDisplayMode(calendar.getCurrentCalendarDisplayMode())
                .ifPresent(it -> {
                    if (it.equals(CalendarViewMode.DAY) || it.equals(CalendarViewMode.WEEK)) {
                        dialogWindows.detail(this, Visit.class)
                                .newEntity()
                                .withInitializer(visit -> {
                                    visit.setVisitStart(event.getStartDateTime());
                                    visit.setVisitEnd(event.getEndDateTime());
                                })
                                .withAfterCloseListener((DialogWindow.AfterCloseEvent<View<?>> afterCloseEvent) -> {
                                    if (afterCloseEvent.closedWith(StandardOutcome.SAVE)) {
                                        reloadEvents();
                                    }
                                })
                                .open();
                    }
                });
    }

    @Subscribe("calendar")
    public void onCalendarEventResize(final EventResizeEvent event) {
        updateVisit(event.getCalendarEvent());
    }

    @Subscribe("calendar")
    public void onCalendarEventDrop(final EventDropEvent event) {
        updateVisit(event.getCalendarEvent());
    }

    private void updateVisit(EntityCalendarEvent<Visit> event) {
        LocalDateTime visitStart = event.getEntity().getVisitStart();
        LocalDateTime visitEnd = event.getEntity().getVisitEnd();
        log.info("Visit time changed to: {} - {}", visitStart, visitEnd);
        dataContext.save();
    }

    @Subscribe("calendar")
    public void onCalendarDatesSet(final DatesSetEvent event) {
        DisplayModeInfo displayModeInfo = event.getDisplayModeInfo();

        loadEvents(displayModeInfo.getActiveStartDate().atStartOfDay(), displayModeInfo.getActiveEndDate().atStartOfDay());

        CalendarViewMode.fromCalendarDisplayMode(displayModeInfo.getDisplayMode())
                .ifPresent(it -> {
                    setCalendarViewMode(it);
                    event.getSource().setSelectionEnabled(
                            it == CalendarViewMode.DAY
                                    || it == CalendarViewMode.WEEK);
                });

        calendarTitle.setText(calculateTitle(event));
    }

    private String calculateTitle(DatesSetEvent e) {
        LocalDate currentStartDate = e.getDisplayModeInfo().getCurrentStartDate();
        return switch (calendarViewMode.getValue()) {
            case WEEK, MONTH ->
                    MonthFormatter.fullMonthYear(YearMonth.from(currentStartDate), currentAuthentication.getLocale());

            case DAY -> datatypeFormatter.formatLocalDate(currentStartDate);
        };
    }

    @Subscribe("visitTypeField")
    public void onVisitTypeFieldComponentValueChange(final AbstractField.ComponentValueChangeEvent<JmixCheckboxGroup, Set<VisitType>> event) {
        visitsCalendarDl.setParameter("type", event.getValue());

        if (visitsCalendarDl.getParameters().containsKey("visitStart") && visitsCalendarDl.getParameters().containsKey("visitEnd")) {
            visitsCalendarDl.load();
        }
    }

    private void loadEvents(LocalDateTime start, LocalDateTime end) {
        if (parameterValueChanged("visitStart", start) || parameterValueChanged("visitEnd", end)) {
            visitsCalendarDl.setParameter("visitStart", start);
            visitsCalendarDl.setParameter("visitEnd", end);
            visitsCalendarDl.load();
        }
    }

    private boolean parameterValueChanged(String parameterName, LocalDateTime newValue) {
        return !Objects.equals(visitsCalendarDl.getParameter(parameterName), newValue);
    }

    private void reloadEvents() {
        visitsCalendarDl.load();
    }

    @Subscribe("contentTabSheet")
    public void onContentTabSheetSelectedChange(final JmixTabSheet.SelectedChangeEvent event) {
        if (Objects.equals(event.getSelectedTab(), contentTabSheetAllVisitsTab) &&
                !Objects.equals(event.getPreviousTab(), contentTabSheetAllVisitsTab)
        ) {
            visitsDl.load();
        }
    }

    // tag::type-selection[]
    @Subscribe("visitsDataGrid.create")
    public void onVisitsDataGridCreate(final ActionPerformedEvent event) {
        dialogs.createInputDialog(this)
                .withHeader(messageBundle.getMessage("createVisitsDialog.header"))
                .withParameter(
                        InputParameter.parameter("type")
                                .withField(() -> {
                                    JmixSelect<Class<? extends Visit>> select = createSelectComponent();

                                    Map<Class<? extends Visit>, String> visitTypes = Map.of( // <1>
                                        EmergencyVisit.class, entityCaption(EmergencyVisit.class),
                                        RegularCheckup.class, entityCaption(RegularCheckup.class),
                                        FollowUpVisit.class, entityCaption(FollowUpVisit.class)
                                    );

                                    ComponentUtils.setItemsMap(select, visitTypes);
                                    return select;
                                })
                                .withLabel(messageBundle.getMessage("createVisitsDialog.selectLabel"))
                )
                .withActions(DialogActions.OK_CANCEL)
                .withCloseListener(closeEvent -> {

                    if (closeEvent.closedWith(DialogOutcome.OK)) {
                        Class<? extends Visit> selectedType = closeEvent.getValue("type"); // <2>

                        if (selectedType != null) {
                            viewNavigators.detailView(this, selectedType) // <3>
                                    .newEntity()
                                    .navigate();
                        }
                    }
                })
                .open();
    }

    private JmixSelect<Class<? extends Visit>> createSelectComponent() {
        JmixSelect<Class<? extends Visit>> select = uiComponents.create(JmixSelect.class);
        select.setRequired(true);
        select.setWidthFull();
        return select;
    }

    private String entityCaption(Class<? extends Visit> entityClass) {
        return messageTools.getEntityCaption(metadata.getClass(entityClass));
    }
    // end::type-selection[]
// tag::end-class[]
}
// end::end-class[]