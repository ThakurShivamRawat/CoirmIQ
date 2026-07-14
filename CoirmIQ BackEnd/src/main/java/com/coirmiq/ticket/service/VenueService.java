package com.coirmiq.ticket.service;

import com.coirmiq.ticket.domain.entity.User;
import com.coirmiq.ticket.domain.entity.Venue;
import com.coirmiq.ticket.dto.VenueRequest;
import com.coirmiq.ticket.exception.ResourceNotFoundException;
import com.coirmiq.ticket.repository.UserRepository;
import com.coirmiq.ticket.repository.VenueRepository;
import com.coirmiq.ticket.specification.VenueSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coirmiq.ticket.domain.entity.Role;
import com.coirmiq.ticket.domain.entity.Section;
import com.coirmiq.ticket.domain.entity.Row;
import com.coirmiq.ticket.dto.SectionRequest;
import com.coirmiq.ticket.dto.RowRequest;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<Venue> getAllVenues(String name, String city, Pageable pageable) {
        log.info("Fetching all venues");
        Specification<Venue> spec = VenueSpecification.withFilters(name, city, null, null);
        return venueRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Venue> getVenuesByHostId(UUID hostId, Pageable pageable) {
        log.info("Fetching venues for host ID: {}", hostId);
        return venueRepository.findByHostId(hostId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Venue> searchVenues(String name, String city, String pincode, String address, Pageable pageable) {
        log.info("Searching venues with active filter sets");
        Specification<Venue> spec = VenueSpecification.withFilters(name, city, pincode, address);
        return venueRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public Venue getVenueHierarchy(UUID venueId) {
        log.info("Fetching venue hierarchy for venue ID: {}", venueId);
        return venueRepository.findHierarchyById(venueId)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + venueId));
    }

    @Transactional(readOnly = true)
    public Venue getVenueById(UUID id) {
        log.info("Fetching venue by ID: {}", id);
        return venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with ID: " + id));
    }

    @Transactional
    public Venue createVenue(VenueRequest request, User currentUser) {
        log.info("Creating new venue entity: {}", request.getName());

        Venue venue = Venue.builder()
                .host(currentUser)
                .name(request.getName())
                .address(request.getAddress())
                .buildingNumber(request.getBuildingNumber())
                .city(request.getCity())
                .pincode(request.getPincode())
                .landmark(request.getLandmark())
                .build();

        return venueRepository.save(venue);
    }

    @Transactional
    public Section addSectionToVenue(UUID venueId, SectionRequest request, User currentUser) {
        Venue venue = getVenueById(venueId);
        if (currentUser.getRole() != Role.ADMIN && !venue.getHost().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Not authorized to modify this venue.");
        }
        Section section = Section.builder().venue(venue).sectionName(request.getSectionName()).build();
        venue.addSection(section);
        venueRepository.save(venue);
        return section;
    }

    @Transactional
    public Row addRowToSection(UUID venueId, UUID sectionId, RowRequest request, User currentUser) {
        Venue venue = getVenueById(venueId);
        if (currentUser.getRole() != Role.ADMIN && !venue.getHost().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Not authorized to modify this venue.");
        }
        Section section = venue.getSections().stream().filter(s -> s.getId().equals(sectionId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        Row row = Row.builder().section(section).rowName(request.getRowName()).capacity(request.getCapacity()).build();
        section.addRow(row);
        venueRepository.save(venue);
        return row; 
    }
}